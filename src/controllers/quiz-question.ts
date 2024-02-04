import { Request, Response } from 'express';
import mongoose, { ObjectId } from 'mongoose';
// import crypto from 'crypto';

// helpers
import { HttpError } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';

// models
import QuizQuestion from '../models/QuizQuestion';
// import User from '../models/User';
// import Quiz from '../models/Quiz';


const addNewQuizQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { quizId, time, imageUrl = '', type, descr, answers, validAnswer = '75b9b74a5af6ce975d92ee51', validAnswerIndex } = req.body;

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

        // НЕНУЖНАЯ СЕКЦИЯ!!!!
        // generate answers id's, amd set validAnswer
        //   interface DescriptionObject {
        //   descr: string;
        //   }

        //   const arrayOfDescriptions = answers.map((obj: DescriptionObject) => ({
        //       ...(obj as DescriptionObject),
        //       id: crypto.randomUUID().toString()
        //   }));

        //   const validDescr = arrayOfDescriptions[validAnswer].id
        // НЕНУЖНАЯ СЕКЦИЯ!!!!
        
        // const quizQuestion = new QuizQuestion ({
        //     quiz: quizId,
        //     time: time,
        //     answers: answers,
        //     imageUrl: imageUrl,
        //     type: type,
        //     descr: descr,
        //     validAnswer: answers[validAnswerIndex]._id,
        // });

        const quizQuestion = {
            quiz: quizId,
            time: time,
            answers: answers,
            imageUrl: imageUrl,
            type: type,
            descr: descr,
            validAnswer: answers[validAnswerIndex]._id,
        };


        console.log(quizQuestion, validAnswerIndex);

        const createdQuizQuestion = await QuizQuestion.create(quizQuestion)

        res.status(201).json({ createdQuizQuestion });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const updateQuizQuestionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid quiz ID' });
            return;
        }

        const { _id, ...updatedData } = req.body;

        const existingQuiz = await QuizQuestion.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        if (!existingQuiz) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }

        res.status(200).json(existingQuiz);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const deleteQuizQuestionById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw HttpError(400, 'Invalid quiz ID');
        }

        const result = await QuizQuestion.findByIdAndDelete(id);

        if (!result) {
            throw HttpError(404, 'Quiz not found');
        }

        res.status(204).json({ message: 'Quiz deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const deleteQuizQuestionImgById = async (req: Request, res: Response): Promise<void> => {
    // const { id } = req.params;

    // try {
    //     if (!mongoose.Types.ObjectId.isValid(id)) {
    //         throw HttpError(400, 'Invalid quiz ID');
    //     }

    //     const result = await QuizQuestion.findByIdAndDelete(id);

    //     if (!result) {
    //         throw HttpError(404, 'Quiz not found');
    //     }

        res.status(204).json({});
    // } catch (error: any) {
    //     res.status(500).json({ message: error.message });
    // }
};


export default {
    addNewQuizQuestion: ctrlWrapper(addNewQuizQuestion),
    updateQuizQuestionById: ctrlWrapper(updateQuizQuestionById),
    deleteQuizQuestionById: ctrlWrapper(deleteQuizQuestionById),
    deleteQuizQuestionImgById: ctrlWrapper(deleteQuizQuestionImgById),
};
