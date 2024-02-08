import { Quiz, QuizCategory } from '../models/Quiz';
import { Request, Response } from 'express';
import { HttpError } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';
import mongoose from 'mongoose';

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
    const { category, page, pageSize, rating, finished, title, inputText } =
        req.query;

    const currentPage: number = page ? parseInt(page.toString(), 10) : 1;
    const itemsPerPage: number = pageSize
        ? parseInt(pageSize.toString(), 10)
        : 4;

    const startIndex: number = (currentPage - 1) * itemsPerPage;
    // let sortCriteria: any | undefined;

    try {
        const totalQuizzesCount = await Quiz.countDocuments({
            ageGroup: category,
        });

        const resultQuizCategories = await QuizCategory.find({
            ageGroup: category,
        });

        let resultQuizesByCategory;

        if (Array.isArray(category)) {
            resultQuizesByCategory = await Quiz.find({})
                .skip(startIndex)
                .limit(itemsPerPage);
        } else {
            resultQuizesByCategory = await Quiz.find({
                ageGroup: category,
            })
                .skip(startIndex)
                .limit(itemsPerPage);
        }

        let result;

        if (rating) {
            result = resultQuizesByCategory
                .sort((a, b) => (a.rating > b.rating ? -1 : 1))
                .find(a => a.rating < +rating);
        } else {
            result = resultQuizesByCategory.sort((a, b) =>
                a.finished > b.finished ? -1 : 1
            );
        }

        res.json({
            data: result,
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
    const { id } = req.body.user;

    const categories = await QuizCategory.find({ ageGroup: 'adults' });
    if (!categories) {
        throw HttpError(400, 'DB is not available');
    }

    const result = await Quiz.create({ theme, owner: id });
    const { _id, background, ageGroup } = result;

    res.status(201).json({
        status: 'OK',
        code: 201,
        data: {
            _id,
            theme,
            categories,
            background,
            ageGroup,
        },
    });
};

const updateQuizById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const { user } = req.body;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
        throw HttpError(404, "Bad Request")
    };
    
    if (quiz.owner.toString() !== user._id.toString()) {
        throw HttpError(401, "Unauthorized")
    }

    const { ...updatedData } = req.body;
    

    const existingQuiz = await Quiz.findByIdAndUpdate(id, { updatedData }, {
        new: true,
    });
    if (!existingQuiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    res.status(200).json( existingQuiz );
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
