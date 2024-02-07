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
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw (0, index_1.HttpError)(400, 'Invalid quiz ID');
            return;
        }
        const result = yield Quiz_1.Quiz.findOne({
            _id: new mongoose_1.default.Types.ObjectId(id),
        });
        if (!result) {
            throw (0, index_1.HttpError)(404, 'Quiz not found');
            return;
        }
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getQuizByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, page, pageSize, rating, finished } = req.query;
    const currentPage = page ? parseInt(page.toString(), 10) : 1;
    const itemsPerPage = pageSize
        ? parseInt(pageSize.toString(), 10)
        : 4;
    try {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const totalQuizzesCount = yield Quiz_1.Quiz.countDocuments({
            ageGroup: category,
        });
        const resultQuizCategories = yield Quiz_1.QuizCategory.find({
            ageGroup: category,
        });
        let sortCriteria;
        if (rating) {
            sortCriteria = {
                rating: parseInt(rating.toString(), 10) > 0 ? 1 : -1,
            };
        }
        else if (finished) {
            sortCriteria = {
                finished: parseInt(finished.toString(), 10) > 0 ? 1 : -1,
            };
        }
        let resultQuizesByCategory;
        if (Array.isArray(category)) {
            resultQuizesByCategory = yield Quiz_1.Quiz.find({})
                .skip(startIndex)
                .limit(itemsPerPage)
                .sort(sortCriteria);
        }
        else {
            resultQuizesByCategory = yield Quiz_1.Quiz.find({ ageGroup: category })
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const addNewQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { theme } = req.body;
    const categories = yield Quiz_1.QuizCategory.findOne({ ageGroup: 'adults' });
    if (!categories) {
        throw (0, index_1.HttpError)(400, 'DB is not available');
    }
    ;
    const category = categories._id;
    const result = yield Quiz_1.Quiz.create({ theme, category });
    res.status(201).json({ result });
});
const updateQuizById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid quiz ID' });
        return;
    }
    const updatedData = __rest(req.body, []);
    const existingQuiz = yield Quiz_1.Quiz.findByIdAndUpdate(id, updatedData, {
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
    getQuizByCategory: (0, index_2.ctrlWrapper)(getQuizByCategory),
    addNewQuiz: (0, index_2.ctrlWrapper)(addNewQuiz),
    updateQuizById: (0, index_2.ctrlWrapper)(updateQuizById),
    deleteQuizById: (0, index_2.ctrlWrapper)(deleteQuizById),
};
