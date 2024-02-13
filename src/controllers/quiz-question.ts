import { Request, Response } from 'express';
import mongoose, { Schema, Types } from 'mongoose';
import fs from 'fs/promises';
import { promisify } from 'util';

// helpers
import { HttpError } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';

// models
import QuizQuestion, { IQuizQuestion } from '../models/QuizQuestion';
import { Quiz } from '../models/Quiz';

// img handlers
import { cloudinary } from '../conf/envConfs';

const getAllQuestions = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const allQuestions = await QuizQuestion.find({ quiz: id });

    res.status(200).json({
        status: 'OK',
        code: 200,
        data: allQuestions,
    });
};

const addNewQuizQuestion = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    // authenticate
    const user = req.body.user
    
    const quiz = await Quiz.findById(id);

    if (!quiz) {
        throw HttpError(400, "Bad Request")
    };

    if (quiz.owner.toString() !== user._id.toString()) {
        throw HttpError(401, "Unauthorized")
    }
    // 
    function answersDefault(req: Request) {
        if (req.body.type === 'true-or-false') {
            return [
                {
                    descr: '',
                },
                {
                    descr: '',
                },
            ];
        } else {
            return [
                {
                    descr: '',
                },
                {
                    descr: '',
                },
                {
                    descr: '',
                },
                {
                    descr: '',
                },
            ];
        }
    }
    const answersDefaultArray = answersDefault(req);
    const {
        time = '0:45',
        imageUrl = '',
        type,
        descr = '',
        answers = answersDefaultArray,
        validAnswerIndex,
    } = req.body;



    // generate answers id's, and set validAnswer as ObjectId
    interface DescriptionObject {
        descr: string;
    }

    const arrayOfDescriptions = answers.map((obj: DescriptionObject) => ({
        ...(obj as DescriptionObject),
        _id: new Types.ObjectId(),
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
    const createdQuizQuestion = await QuizQuestion.create(quizQuestion);

    res.status(201).json({
        status: 'OK',
        code: 201,
        data: [createdQuizQuestion],
    });
};

const questionImg = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    // authenticate
    const user = req.body.user;
    const quizQuestion = await QuizQuestion.findById(id);
    
    if (!quizQuestion) {
        throw HttpError(400, "Bad Request")
    };
    
    const quiz = await Quiz.findById(quizQuestion.quiz);
    
    if (!quiz) {
        throw HttpError(400, "Bad Request")
    };

    if (quiz.owner.toString() !== user._id.toString()) {
        throw HttpError(401, "Unauthorized")
    };

    // work with img
    if (!req.file || !req.file.path) {
        throw HttpError(400, 'Bad Request');
    };

    const cloudinaryUpload = promisify(cloudinary.uploader.upload);
    const result = await cloudinaryUpload(req.file.path);
    
    await fs.unlink(req.file.path);

    if (!result) {
        throw HttpError(500, 'file upload failed');
    }

    const question = await QuizQuestion.findByIdAndUpdate(
        id,
        { imageUrl: result.public_id },
        { new: true }
    );

    if (!question) {
        throw HttpError(400, 'question not found');
    }

    const { _id, imageUrl } = question;

    res.status(201).json({
        status: 'OK',
        code: 201,
        data: {
            _id,
            imageUrl,
        },
    });
};

const updateQuizQuestionById = async (
    req: Request,
    res: Response
): Promise<void> => {
    // Прикрутить авторизацию
    const { id } = req.params;
        // authenticate
    const user = req.body.user

    const question  = await QuizQuestion.findById(id)

    if (!question) {
        throw HttpError(400, "Bad Request")
    };

    const isQuizExists = await Quiz.findById(question.quiz);

    if (!isQuizExists) {
        throw HttpError(400, "Bad Request")
    };

    if (isQuizExists.owner.toString() !== user._id.toString()) {
        throw HttpError(401, "Unauthorized")
    }
    // 

    const newData = req.body;

    if (newData.answers && newData.validAnswerIndex) {
        newData.validAnswer = newData.answers[newData.validAnswerIndex]._id;
        delete newData.validAnswerIndex;
    } else if (newData.validAnswerIndex) {
        const question: IQuizQuestion | null = await QuizQuestion.findById(id)

        if (!question) {
            throw HttpError(404, 'Question not found')
        }

        newData.validAnswer = question.answers[req.body.validAnswerIndex]._id;
        delete newData.validAnswerIndex;
    }

    const existingQuiz = await QuizQuestion.findByIdAndUpdate(id, { ...newData }, { new: true });

    if (!existingQuiz) {
        throw HttpError(404, 'Bad Request');
    }

    res.status(200).json({
        status: 'OK',
        code: 200,
        data: [existingQuiz],
    });
};

const deleteQuizQuestionById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

        // authenticate
    const user = req.body.user
    
    const quiz = await Quiz.findById(id);

    if (!quiz) {
        throw HttpError(400, "Bad Request")
    };

    if (quiz.owner.toString() !== user._id.toString()) {
        throw HttpError(401, "Unauthorized")
    }
    // 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw HttpError(400, 'Invalid quiz ID');
    }

    const result = await QuizQuestion.findByIdAndDelete(id);

    if (!result) {
        throw HttpError(404, 'Quiz not found');
    }

    res.status(204).json({});
};

const deleteQuizQuestionImgById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    // authenticate
    const user = req.body.user
    
    const quiz = await Quiz.findById(id);

    if (!quiz) {
        throw HttpError(400, "Bad Request")
    };

    if (quiz.owner.toString() !== user._id.toString()) {
        throw HttpError(401, "Unauthorized")
    }
    // 

    const question = await QuizQuestion.findByIdAndUpdate(id, { imageUrl: '' });
    console.log(question);

    if (!question) {
        throw HttpError(404, 'Question not found');
    }

    if (question.imageUrl === '') {
        throw HttpError(404, 'Image not found');
    }

    const cloudinaryDeletion = promisify(cloudinary.uploader.destroy);
    const result = await cloudinaryDeletion(question.imageUrl);

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
