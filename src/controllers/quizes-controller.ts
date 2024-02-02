import Quiz from '../models/Quiz';
import { Request, Response } from 'express';
// import { HttpError } from "../helpers/index";
import { ctrlWrapper } from '../decorators/index';
import mongoose from 'mongoose';

const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Quiz.find({}, '-createdAt -updatedAt');
        res.json(result);
    } catch (error) {
        console.error('Помилка отримання даних:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAllByRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Quiz.find({}, '-createdAt -updatedAt').sort({
            rating: -1,
        }); // Сортування за зменшенням рейтингу

        res.json(result);
    } catch (error) {
        console.error('Помилка отримання даних:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

import { ObjectId } from 'mongoose';

const getQuizeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid quiz ID' });
            return;
        }

        const result = await Quiz.findOne({
            _id: new mongoose.Types.ObjectId(id),
        });

        if (!result) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error('Помилка отримання даних:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const addNewQuize = async (req: Request, res: Response): Promise<void> => {
    try {
        // Отримання даних з тіла запиту
        const {
            theme,
            category,
            background,
            ageGroup,
            ratingQuantity,
            rating,
            finished,
        } = req.body;

        if (!mongoose.Types.ObjectId.isValid(category)) {
            res.status(400).json({ error: 'Invalid category ID' });
            return;
        }
        const categoryObjectId = new mongoose.Types.ObjectId(category);
        console.log(categoryObjectId);

        const newQuiz = new Quiz({
            theme,
            category: categoryObjectId,
            background,
            ageGroup,
            ratingQuantity,
            rating,
            finished,
        });

        const savedQuiz = await newQuiz.save();

        res.status(201).json(savedQuiz);
    } catch (error) {
        console.error('Помилка при додаванні тесту:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateById = async (req: Request, res: Response): Promise<void> => {};


const deleteQuizeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid quiz ID' });
            return;
        }

        const result = await Quiz.findByIdAndDelete(id);

        if (!result) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }

        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Помилка при видаленні тесту:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




export default {
    getAll: ctrlWrapper(getAll),
    getAllByRating: ctrlWrapper(getAllByRating),
    getQuizeById: ctrlWrapper(getQuizeById),
    addNewQuize: ctrlWrapper(addNewQuize),
    updateById: ctrlWrapper(updateById),
    deleteQuizeById: ctrlWrapper(deleteQuizeById),
};
