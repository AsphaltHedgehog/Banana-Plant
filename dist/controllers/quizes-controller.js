"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Quiz_1 = require("../models/Quiz");
const index_1 = require("../helpers/index");
const index_2 = require("../decorators/index");
const mongoose_1 = __importStar(require("mongoose"));
const QuizQuestion_1 = __importDefault(require("../models/QuizQuestion"));
const getTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalPassedQuizzes = yield Quiz_1.Quiz.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$finished" }
            }
        }
    ]);
    const totalPassedQuizzesCount = totalPassedQuizzes.length > 0 ? totalPassedQuizzes[0].total : 0;
    res.json({ totalPassedQuizzes: totalPassedQuizzesCount });
});
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, pageSize } = req.query;
    const currentPage = page ? parseInt(page.toString(), 10) : 1;
    const itemsPerPage = pageSize
        ? parseInt(pageSize.toString(), 10)
        : 4;
    try {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const totalQuizzesCount = yield Quiz_1.Quiz.countDocuments({});
        const result = yield Quiz_1.Quiz.find({}, '-createdAt -updatedAt')
            .skip(startIndex)
            .limit(itemsPerPage);
        res.json({
            result,
            totalQuizes: totalQuizzesCount,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getAllByRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Quiz_1.Quiz.find({}, '-createdAt -updatedAt').sort({
            rating: -1,
        });
        res.json(result);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});
const getQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const pipeline = [
        {
            $match: {
                _id: new mongoose_1.default.Types.ObjectId(id),
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
    const result = yield Quiz_1.Quiz.aggregate(pipeline);
    if (!result) {
        throw (0, index_1.HttpError)(404, 'Quiz not found');
    }
    res.status(200).json(...result);
});
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Quiz_1.QuizCategory.find();
        res.status(200).json({
            status: 'OK',
            code: 200,
            data: {
                result,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getFavoritesQuizes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.query);
    const { favorite } = req.body.user;
    const pipeline = [
        {
            $match: { _id: { $in: favorite } },
        },
    ];
    try {
        const result = yield Quiz_1.Quiz.aggregate(pipeline);
        console.log(result);
        res.status(200).json({
            status: 'OK',
            code: 200,
            data: {
                result,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getMyQuizes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.body.user;
    const { page, pageSize } = req.query;
    const pipeline = [
        {
            $match: {
                owner: _id,
            },
        },
    ];
    if (page &&
        typeof page === 'string' &&
        pageSize &&
        typeof pageSize === 'string') {
        const skip = page ? (parseInt(page) - 1) * parseInt(pageSize) : 0;
        const limit = pageSize ? parseInt(pageSize) : 10;
        pipeline.push({
            $facet: {
                pagination: [{ $skip: skip }, { $limit: limit }],
            },
        });
    }
    try {
        const result = yield Quiz_1.Quiz.aggregate(pipeline);
        res.json({
            status: 'OK',
            code: 200,
            data: {
                result,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getQuizByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ageGroup, page, pageSize, rating, finished, title, inputText, favorites, } = req.query;
    const matchStage = {};
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
    if (page &&
        typeof page === 'string' &&
        pageSize &&
        typeof pageSize === 'string') {
        const skip = page ? (parseInt(page) - 1) * parseInt(pageSize) : 0;
        const limit = pageSize ? parseInt(pageSize) : 10;
        pipeline.push({
            $facet: {
                pagination: [{ $skip: skip }, { $limit: limit }],
            },
        });
    }
    try {
        const result = yield Quiz_1.Quiz.aggregate(pipeline);
        const totalResult = yield Quiz_1.Quiz.aggregate([
            { $match: { ageGroup: ageGroup } },
            { $count: 'total' },
        ]);
        const categoryCategory = yield Quiz_1.QuizCategory.aggregate([
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const addNewQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { theme } = req.body;
    const { id } = req.body.user;
    const categories = yield Quiz_1.QuizCategory.find({ ageGroup: 'adults' });
    if (!categories) {
        throw (0, index_1.HttpError)(400, 'DB is not available');
    }
    const result = yield Quiz_1.Quiz.create({ theme, owner: id });
    const { _id, background, ageGroup } = result;
    const answerArray = [
        {
            descr: '',
            _id: new mongoose_1.Types.ObjectId(),
        },
        {
            descr: '',
            _id: new mongoose_1.Types.ObjectId(),
        },
        {
            descr: '',
            _id: new mongoose_1.Types.ObjectId(),
        },
        {
            descr: '',
            _id: new mongoose_1.Types.ObjectId(),
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
    yield QuizQuestion_1.default.create(quizQuestion);
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
});
const updateQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { user } = req.body;
    const quiz = yield Quiz_1.Quiz.findById(id);
    if (!quiz) {
        throw (0, index_1.HttpError)(404, 'Bad Request');
    }
    if (quiz.owner.toString() !== user._id.toString()) {
        throw (0, index_1.HttpError)(401, 'Unauthorized');
    }
    const { theme, category, background, ageGroup } = req.body;
    const updatedQuiz = yield Quiz_1.Quiz.findByIdAndUpdate(id, { theme, category, background, ageGroup }, {
        new: true,
    });
    if (!updatedQuiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }
    res.status(200).json(updatedQuiz);
});
const deleteQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw (0, index_1.HttpError)(400, 'Invalid quiz ID');
            return;
        }
        const result = yield Quiz_1.Quiz.findByIdAndDelete(id);
        if (!result) {
            throw (0, index_1.HttpError)(404, 'Quiz not found');
            return;
        }
        res.status(204).json({ message: 'Quiz deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ageGroup } = req.query;
    const result = yield Quiz_1.QuizCategory.find({ ageGroup });
    res.status(200).json(result);
});
exports.default = {
    getAll: (0, index_2.ctrlWrapper)(getAll),
    getAllByRating: (0, index_2.ctrlWrapper)(getAllByRating),
    getQuizById: (0, index_2.ctrlWrapper)(getQuizById),
    getAllCategory: (0, index_2.ctrlWrapper)(getAllCategory),
    getQuizByCategory: (0, index_2.ctrlWrapper)(getQuizByCategory),
    addNewQuiz: (0, index_2.ctrlWrapper)(addNewQuiz),
    updateQuizById: (0, index_2.ctrlWrapper)(updateQuizById),
    deleteQuizById: (0, index_2.ctrlWrapper)(deleteQuizById),
    getFavoritesQuizes: (0, index_2.ctrlWrapper)(getFavoritesQuizes),
    getMyQuizes: (0, index_2.ctrlWrapper)(getMyQuizes),
    getCategory: (0, index_2.ctrlWrapper)(getCategory),
    getTotal: (0, index_2.ctrlWrapper)(getTotal)
};
