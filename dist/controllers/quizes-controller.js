"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Quiz_1 = require("../models/Quiz");
const index_1 = require("../helpers/index");
const index_2 = require("../decorators/index");
const mongoose_1 = __importDefault(require("mongoose"));
const QuizQuestion_1 = __importDefault(require("../models/QuizQuestion"));
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
    const { favorites } = req.body;
    try {
        const result = yield Quiz_1.Quiz.find({ _id: { $in: favorites } });
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
const getQuizesByOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { owner } = req.body;
    try {
        const result = yield Quiz_1.Quiz.find({ owner: { $in: owner } });
        res.json(result);
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
    const quizQuestion = {
        quiz: _id,
        time: '00:30',
        descr: '',
        type: 'full-text',
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
    const updatedData = __rest(req.body, []);
    const existingQuiz = yield Quiz_1.Quiz.findByIdAndUpdate(id, { updatedData }, {
        new: true,
    });
    if (!existingQuiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }
    res.status(200).json(existingQuiz);
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
    getQuizesByOwner: (0, index_2.ctrlWrapper)(getQuizesByOwner),
};
