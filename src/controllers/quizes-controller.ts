import Quiz from '../models/Quiz';
import { Request, Response } from 'express';
import { HttpError } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';
import mongoose from 'mongoose';

const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Quiz.find({}, '-createdAt -updatedAt');
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getAllByRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Quiz.find({}, '-createdAt -updatedAt').sort({
            rating: -1,
        }); // Сортування за зменшенням рейтингу

        res.json(result);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const getQuizeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw HttpError(400, 'Invalid quiz ID');
            return;
        }

        const result = await Quiz.findOne({
            _id: new mongoose.Types.ObjectId(id),
        });

        if (!result) {
            throw HttpError(404, 'Quiz not found');
            return;
        }

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const addNewQuize = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category } = req.body;

        if (!mongoose.Types.ObjectId.isValid(category)) {
            res.status(400).json({ error: 'Invalid category ID' });
            return;
        }
        const categoryObjectId = new mongoose.Types.ObjectId(category);

        const newQuize = new Quiz({
            ...req.body,
            category: categoryObjectId,
        });
        const quize = await newQuize.save();
        console.log(newQuize);

        res.status(201).json(newQuize);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const updateById = async (req: Request, res: Response): Promise<void> => {};

const deleteQuizeById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw HttpError(400, 'Invalid quiz ID');
            return;
        }

        const result = await Quiz.findByIdAndDelete(id);

        if (!result) {
            throw HttpError(404, 'Quiz not found');
            return;
        }

        res.status(204).json({ message: 'Quiz deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
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
