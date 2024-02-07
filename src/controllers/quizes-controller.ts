import { Quiz, QuizCategory } from '../models/Quiz';
import { Request, Response } from 'express';
import { HttpError } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';
import mongoose, { ObjectId } from 'mongoose';

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { page, pageSize } = req.query;
    const currentPage: number = page ? parseInt(page.toString(), 10) : 1;
    const itemsPerPage: number = pageSize
        ? parseInt(pageSize.toString(), 10)
        : 4;

    try {
        const startIndex: number = (currentPage - 1) * itemsPerPage;
        const totalQuizzesCount = await Quiz.countDocuments({});

        const result = await Quiz.find({}, '-createdAt -updatedAt')
            .skip(startIndex)
            .limit(itemsPerPage);
        res.json({
            result,
            totalQuizes: totalQuizzesCount,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getAllByRating = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await Quiz.find({}, '-createdAt -updatedAt').sort({
            rating: -1,
        });

        res.json(result);
    } catch (error: any) {
        res.status(error.status || 500).json({ message: error.message });
    }
};

const getQuizById = async (req: Request, res: Response): Promise<void> => {
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

const getQuizByCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { category, page, pageSize, rating, finished } = req.query;

    const currentPage: number = page ? parseInt(page.toString(), 10) : 1;
    const itemsPerPage: number = pageSize
        ? parseInt(pageSize.toString(), 10)
        : 4;

    try {
        const startIndex: number = (currentPage - 1) * itemsPerPage;

        const totalQuizzesCount = await Quiz.countDocuments({
            ageGroup: category,
        });

        const resultQuizCategories = await QuizCategory.find({
            ageGroup: category,
        });

        let sortCriteria: { [key: string]: 1 | -1 } | undefined;

        if (rating) {
            sortCriteria = {
                rating: parseInt(rating.toString(), 10) > 0 ? 1 : -1,
            };
        } else if (finished) {
            sortCriteria = {
                finished: parseInt(finished.toString(), 10) > 0 ? 1 : -1,
            };
        }

        let resultQuizesByCategory;

        if (Array.isArray(category)) {
            resultQuizesByCategory = await Quiz.find({})
                .skip(startIndex)
                .limit(itemsPerPage)
                .sort(sortCriteria);
        } else {
            resultQuizesByCategory = await Quiz.find({ ageGroup: category })
                .skip(startIndex)
                .limit(itemsPerPage)
                .sort(sortCriteria);
        }

        res.json({
            data: resultQuizesByCategory,
            categories: resultQuizCategories,
            currentPage,
            pageSize: itemsPerPage,
            totalPages: Math.ceil(totalQuizzesCount / itemsPerPage),
            totalQuizzesCount,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const addNewQuiz = async (req: Request, res: Response): Promise<void> => {
    const { theme } = req.body;

    const categories = await QuizCategory.find({ ageGroup: 'adults' });
    if (!categories) {
        throw HttpError(400, 'DB is not available')
    };
    const categoryId = categories[0]._id

    const result = await Quiz.create({ theme, categoryId });
    const { _id, background, ageGroup } = result;

    res.status(201).json({
        status: 'OK',
        code: 201,
        data: {
            _id,
            theme,
            categories,
            background,
            ageGroup
        }
    });
};

const updateQuizById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid quiz ID' });
        return;
    }

    const {...updatedData } = req.body;

    const existingQuiz = await Quiz.findByIdAndUpdate(id, updatedData, {
        new: true,
    });
    if (!existingQuiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    res.status(200).json(existingQuiz);
};

const deleteQuizById = async (req: Request, res: Response): Promise<void> => {
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
    getQuizById: ctrlWrapper(getQuizById),
    getQuizByCategory: ctrlWrapper(getQuizByCategory),
    addNewQuiz: ctrlWrapper(addNewQuiz),
    updateQuizById: ctrlWrapper(updateQuizById),
    deleteQuizById: ctrlWrapper(deleteQuizById),
};
