import { Quiz, QuizCategory } from '../models/Quiz';
import { Request, Response } from 'express';
import { HttpError } from '../helpers/index';
import { ctrlWrapper } from '../decorators/index';
import mongoose, { Types } from 'mongoose';
import QuizQuestion from '../models/QuizQuestion';

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
    const pipeline = [
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id),
            },
        },
        {
            $lookup: {
                from: 'quizquestions',
                localField: '_id',
                foreignField: 'quiz',
                as: 'questions',
            },
        },
    ];

    const result = await Quiz.aggregate(pipeline);

    if (!result) {
        throw HttpError(404, 'Quiz not found');
    }

    res.status(200).json(...result);
};

const getAllCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await QuizCategory.find();

        res.status(200).json({
            status: 'OK',
            code: 200,
            data: {
                result,
            },
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getFavoritesQuizes = async (
    req: Request,
    res: Response
): Promise<void> => {
    console.log(req.query);
    const { favorite } = req.body.user;

    const pipeline = [
        {
            $match: { _id: { $in: favorite } },
        },
    ];

    try {
        const result = await Quiz.aggregate(pipeline);
        console.log(result);

        res.status(200).json({
            status: 'OK',
            code: 200,
            data: {
                result,
            },
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const getMyQuizes = async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.body.user;
    const { page, pageSize } = req.query;

    const pipeline = [
        {
            $match: {
                owner: _id,
            },
        },
    ];

    if (
        page &&
        typeof page === 'string' &&
        pageSize &&
        typeof pageSize === 'string'
    ) {
        const skip = page ? (parseInt(page) - 1) * parseInt(pageSize) : 0;
        const limit = pageSize ? parseInt(pageSize) : 10;

        pipeline.push({
            $facet: {
                pagination: [{ $skip: skip }, { $limit: limit }],
            },
        });
    }
    try {
        const result = await Quiz.aggregate(pipeline);

        res.json({
            status: 'OK',
            code: 200,
            data: {
                result,
            },
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

interface IMatchStage {
    ageGroup?: string;
    rating?: object;
    quizIds?: string[];
    theme?: object;
    finished?: object;
}

const getQuizByCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    const {
        ageGroup,
        page,
        pageSize,
        rating,
        finished,
        title,
        inputText,
        favorites,
    } = req.query;
    const matchStage: IMatchStage = {};

    if (ageGroup && typeof ageGroup === 'string') {
        matchStage.ageGroup = ageGroup;
    }

    if (rating && typeof rating === 'string') {
        matchStage.rating = { $lte: parseInt(rating) };
    }

    if (finished && typeof finished === 'string') {
        matchStage.finished = { $lte: parseInt(finished) };
    }

    if (inputText && typeof inputText === 'string') {
        matchStage.theme = {
            $regex: new RegExp(inputText, 'i'),
        };
    }

    const pipeline = [
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryInfo',
            },
        },
        {
            $match: {
                $and: [
                    matchStage,
                    Array.isArray(title)
                        ? { 'categoryInfo.title': { $in: title } }
                        : title
                        ? {
                              'categoryInfo.title': {
                                  $regex: new RegExp(title, 'i'),
                              },
                          }
                        : {},
                ],
            },
        },

        {
            $sort: { rating: -1 }, // Сортування за рейтингом у спадному порядку
        },
    ];

    if (
        page &&
        typeof page === 'string' &&
        pageSize &&
        typeof pageSize === 'string'
    ) {
        const skip = page ? (parseInt(page) - 1) * parseInt(pageSize) : 0;
        const limit = pageSize ? parseInt(pageSize) : 10;

        pipeline.push({
            $facet: {
                pagination: [{ $skip: skip }, { $limit: limit }],
            },
        });
    }

    try {
        const result = await Quiz.aggregate(pipeline);
        const totalResult = await Quiz.aggregate([
            { $match: { ageGroup: ageGroup } },
            { $count: 'total' },
        ]);

        const categoryCategory = await QuizCategory.aggregate([
            {
                $match: { ageGroup: ageGroup },
            },
        ]);

        res.status(200).json({
            status: 'OK',
            code: 200,
            data: {
                result: result[0].pagination,
                category: categoryCategory,
                total: totalResult,
            },
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

    const answerArray = [
        {
            descr: '',
            _id: new Types.ObjectId(),
        },
        {
            descr: '',
            _id: new Types.ObjectId(),
        },
        {
            descr: '',
            _id: new Types.ObjectId(),
        },
        {
            descr: '',
            _id: new Types.ObjectId(),
        },
    ];

    const quizQuestion = {
        quiz: _id,
        time: '00:30',
        descr: '',
        type: 'full-text',
        answers: answerArray,
        validAnswer: answerArray[0]._id,
    };

    await QuizQuestion.create(quizQuestion);

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
        throw HttpError(404, 'Bad Request');
    }

    if (quiz.owner.toString() !== user._id.toString()) {
        throw HttpError(401, 'Unauthorized');
    }

    const { theme, category, background, ageGroup } = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(
        id,
        { theme, category, background, ageGroup },
        {
            new: true,
        }
    ); 

    if (!updatedQuiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    res.status(200).json(updatedQuiz);
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


const getCategory = async (
    req: Request,
    res: Response
): Promise<void> => {
    
    const { ageGroup } = req.query;
    const result = await QuizCategory.find({ageGroup})

    res.status(200).json(result)
};


export default {
    getAll: ctrlWrapper(getAll),
    getAllByRating: ctrlWrapper(getAllByRating),
    getQuizById: ctrlWrapper(getQuizById),
    getAllCategory: ctrlWrapper(getAllCategory),
    getQuizByCategory: ctrlWrapper(getQuizByCategory),
    addNewQuiz: ctrlWrapper(addNewQuiz),
    updateQuizById: ctrlWrapper(updateQuizById),
    deleteQuizById: ctrlWrapper(deleteQuizById),
    getFavoritesQuizes: ctrlWrapper(getFavoritesQuizes),
    getMyQuizes: ctrlWrapper(getMyQuizes),
    getCategory: ctrlWrapper(getCategory),
};
