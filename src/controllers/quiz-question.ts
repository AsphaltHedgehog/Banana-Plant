import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import fs from 'fs/promises';
import { promisify } from 'util';


// helpers
import { HttpError } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';

// models
import QuizQuestion from '../models/QuizQuestion';
// import User from '../models/User';
// import Quiz from '../models/Quiz';

// img handlers
import { cloudinary } from '../conf/envConfs';



const getAllQuestions = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const allQuestions = await QuizQuestion.find({ quiz: id })
    

    res.status(200).json({
        status: 'OK',
        code: 200,
        data: allQuestions
    })
};

const addNewQuizQuestion = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { time, imageUrl = '', type, descr, answers, validAnswerIndex } = req.body;

        // auth (Пока закоменчено чтобы не ломать ничего)
        // const user = req.body.user
        // const quiz = await Quiz.findById(quizId);
        // if (!quiz ) {
        //   throw HttpError(400, "Bad Request")
        // };

        // Уточнить момент где будет храниться владелец Теста, в самом Тесте или в Юзере!?
        // if (!user.ownTests.find(quizId)) {
        //   throw HttpError(401, "Unauthorized")
        // }


        // generate answers id's, and set validAnswer as ObjectId
        interface DescriptionObject {
            descr: string;
        };

        const arrayOfDescriptions = answers.map((obj: DescriptionObject) => ({
            ...(obj as DescriptionObject),
            _id: new Types.ObjectId()
        }));

        const validAnswerId = arrayOfDescriptions[validAnswerIndex]._id;

        const quizQuestion = {
            quiz: id,
            time: time,
            answers: arrayOfDescriptions,
            imageUrl: imageUrl,
            type: type,
            descr: descr,
            validAnswer: validAnswerId,
        };
        const createdQuizQuestion = await QuizQuestion.create(quizQuestion)

        res.status(201).json({
            status: 'OK',
            code: 201,
            data: {
                ...createdQuizQuestion
            }
        });
};


const questionImg = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    // auth (Пока закоменчено чтобы не ломать ничего)
    // const user = req.body.user
    // const quiz = await Quiz.findById(quizId);
    // if (!quiz ) {
    //   throw HttpError(400, "Bad Request")
    // };

    // Уточнить момент где будет храниться владелец Теста, в самом Тесте или в Юзере!?
    // if (!user.ownTests.find(quizId)) {
    //   throw HttpError(401, "Unauthorized")
    // }

    // work with img
    if (!req.file || !req.file.path) {
        throw HttpError(400, "Bad Request")
    };

    const cloudinaryUpload = promisify(cloudinary.uploader.upload)
    const result = await cloudinaryUpload(req.file.path);
    
    await fs.unlink(req.file.path);

    if (!result) {
        throw HttpError(500, 'file upload failed');
    };

    const question = await QuizQuestion.findByIdAndUpdate(id, { imageUrl: result.public_id }, { new: true });

    if (!question) {
        throw HttpError(400, 'question not found');
    };

    const { _id, imageUrl } = question

    res.status(201).json({
        status: 'OK',
        code: 201,
        data: {
            _id,
            imageUrl
        }
    });
};




const updateQuizQuestionById = async (req: Request, res: Response): Promise<void> => {
    // Прикрутить авторизацию
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw HttpError(400, 'Invalid quiz ID');
    }


    // auth (Пока закоменчено чтобы не ломать ничего)
    // const user = req.body.user
    // const quiz = await Quiz.findById(id);
    // if (!quiz ) {
    //   throw HttpError(400, "Bad Request")
    // };

    // Уточнить момент где будет храниться владелец Теста, в самом Тесте или в Юзере!?
    // if (!user.ownTests.find(quizId)) {
    //   throw HttpError(401, "Unauthorized")
    // }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw HttpError(404, "Bad Request");
    }

    const newData = req.body;
        

    if (newData.answers & newData.validAnswerIndex) {
        interface DescriptionObject {
            descr: string;
        };

        const arrayOfDescriptions = newData.answers.map((obj: DescriptionObject) => ({
            ...(obj as DescriptionObject),
            _id: new Types.ObjectId()
        }));
        newData.answers = arrayOfDescriptions;
        delete newData.validAnswerIndex;
        newData.validAnswer = arrayOfDescriptions[newData.validAnswerIndex]._id;
    };

    const existingQuiz = await QuizQuestion.findByIdAndUpdate(id, newData, { new: true });
    if (!existingQuiz) {
        throw HttpError(404, "Bad Request")
    }

    res.status(200).json({
        status: 'OK',
        code: 200,
        data: { ...existingQuiz }
    });
};

const deleteQuizQuestionById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;


    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw HttpError(400, 'Invalid quiz ID');
    }

    const result = await QuizQuestion.findByIdAndDelete(id);

    if (!result) {
        throw HttpError(404, 'Quiz not found');
    }

    res.status(204).json({});

};

const deleteQuizQuestionImgById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;


    // Прикрути аутефикацию)
    // auth (Пока закоменчено чтобы не ломать ничего)
    // const user = req.body.user
    // const quiz = await Quiz.findById(id);
    // if (!quiz) {
    //   throw HttpError(400, "Bad Request")
    // };

    // Уточнить момент где будет храниться владелец Теста, в самом Тесте или в Юзере!?
    // if (!user.ownTests.find(quizId)) {
    //   throw HttpError(401, "Unauthorized")
    // }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw HttpError(400, 'Invalid quiz ID');
    }

    const question = await QuizQuestion.findByIdAndUpdate(id, { imageUrl: '' });
    console.log(question);
    

    if (!question) {
        throw HttpError(404, 'Question not found');
    }

    if (question.imageUrl === '') {
        throw HttpError(404, 'Image not found');
    }
    console.log(question.imageUrl);
    
    const cloudinaryDeletion = promisify(cloudinary.uploader.destroy)
    const result = await cloudinaryDeletion(question.imageUrl)

    if (!result) {
        throw HttpError(500, 'Image deletion failed');
    }

    res.status(204).json({});
};


export default {
    getAllQuestions: ctrlWrapper(getAllQuestions),
    addNewQuizQuestion: ctrlWrapper(addNewQuizQuestion),
    updateQuizQuestionById: ctrlWrapper(updateQuizQuestionById),
    deleteQuizQuestionById: ctrlWrapper(deleteQuizQuestionById),
    deleteQuizQuestionImgById: ctrlWrapper(deleteQuizQuestionImgById),
    questionImg: ctrlWrapper(questionImg),
};
