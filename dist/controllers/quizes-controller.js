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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Quiz_1 = __importDefault(require("../models/Quiz"));
// import { HttpError } from "../helpers/index";
const index_1 = require("../decorators/index");
const mongoose_1 = __importDefault(require("mongoose"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Quiz_1.default.find({}, '-createdAt -updatedAt');
        res.json(result);
    }
    catch (error) {
        console.error('Помилка отримання даних:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const getAllByRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Quiz_1.default.find({}, '-createdAt -updatedAt').sort({
            rating: -1,
        }); // Сортування за зменшенням рейтингу
        res.json(result);
    }
    catch (error) {
        console.error('Помилка отримання даних:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const getQuizeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid quiz ID' });
            return;
        }
        const result = yield Quiz_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(id),
        });
        if (!result) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Помилка отримання даних:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const addNewQuize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Отримання даних з тіла запиту
        const { theme, category, background, ageGroup, ratingQuantity, rating, finished, } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(category)) {
            res.status(400).json({ error: 'Invalid category ID' });
            return;
        }
        const categoryObjectId = new mongoose_1.default.Types.ObjectId(category);
        console.log(categoryObjectId);
        const newQuiz = new Quiz_1.default({
            theme,
            category: categoryObjectId,
            background,
            ageGroup,
            ratingQuantity,
            rating,
            finished,
        });
        const savedQuiz = yield newQuiz.save();
        res.status(201).json(savedQuiz);
    }
    catch (error) {
        console.error('Помилка при додаванні тесту:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const updateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
const deleteQuizeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid quiz ID' });
            return;
        }
        const result = yield Quiz_1.default.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({ error: 'Quiz not found' });
            return;
        }
        res.status(200).json({ message: 'Quiz deleted successfully' });
    }
    catch (error) {
        console.error('Помилка при видаленні тесту:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = {
    getAll: (0, index_1.ctrlWrapper)(getAll),
    getAllByRating: (0, index_1.ctrlWrapper)(getAllByRating),
    getQuizeById: (0, index_1.ctrlWrapper)(getQuizeById),
    addNewQuize: (0, index_1.ctrlWrapper)(addNewQuize),
    updateById: (0, index_1.ctrlWrapper)(updateById),
    deleteQuizeById: (0, index_1.ctrlWrapper)(deleteQuizeById),
};
