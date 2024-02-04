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
    try {
        const result = yield Quiz_1.Quiz.find({}, '-createdAt -updatedAt');
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const getAllByRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Quiz_1.Quiz.find({}, '-createdAt -updatedAt').sort({
            rating: -1,
        }); // Сортування за зменшенням рейтингу
        res.json(result);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});
const getQuizeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
const getQuizesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, page, pageSize } = req.query;
    const currentPage = page ? parseInt(page.toString(), 10) : 1;
    const itemsPerPage = pageSize
        ? parseInt(pageSize.toString(), 10)
        : 4;
    try {
        const totalQuizzesCount = yield Quiz_1.Quiz.countDocuments({
            ageGroup: category,
        });
        const resultQuizCategories = yield Quiz_1.QuizCategory.find({
            ageGroup: category,
        });
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = currentPage * itemsPerPage;
        const resultQuiz = yield Quiz_1.Quiz.find({ ageGroup: category })
            .skip(startIndex)
            .limit(itemsPerPage);
        res.json({
            data: resultQuiz,
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
const addNewQuize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Добавление фотки не в квиз должно быть, а в вопрос квиза
        //         const { category } = req.body;
        //         if (!req.file || !req.file.path) {
        //             res.status(400).json({ error: 'No file uploaded' });
        //             return;
        //         }
        //         const { url: poster } = await cloudinary.uploader.upload(
        //             req.file.path,
        //             {
        //                 folder: 'posters',
        //             }
        //         );
        //         await fs.unlink(req.file.path);
        const { theme, ageGroup } = req.body;
        const result = yield Quiz_1.Quiz.find({ ageGroup: ageGroup });
        const arrQuizesCategory = result.map(q => q.category);
        const quizInfo = new Quiz_1.Quiz({
            theme: theme,
            ageGroup: ageGroup,
            category: arrQuizesCategory,
            background: 'none',
        });
        res.status(201).json(quizInfo);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const updateQuizeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //         const { id } = req.params;
        //         if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        //             res.status(400).json({ error: 'Invalid quiz ID' });
        //             return;
        //         }
        // точно так же, обновление должно быть не напрямую в Квиз, а в Вопросы квиза
        //         const newQuize = new Quiz({
        //             ...req.body,
        //             category: categoryObjectId,
        //             poster,
        //         });
        //         const quize = await newQuize.save();
        const _a = req.body, { _id } = _a, updatedData = __rest(_a, ["_id"]);
        const existingQuiz = yield Quiz_1.Quiz.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        if (!existingQuiz) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }
        res.status(200).json(existingQuiz);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const deleteQuizeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    getQuizeById: (0, index_2.ctrlWrapper)(getQuizeById),
    getQuizesByCategory: (0, index_2.ctrlWrapper)(getQuizesByCategory),
    addNewQuize: (0, index_2.ctrlWrapper)(addNewQuize),
    updateQuizeById: (0, index_2.ctrlWrapper)(updateQuizeById),
    deleteQuizeById: (0, index_2.ctrlWrapper)(deleteQuizeById),
};
