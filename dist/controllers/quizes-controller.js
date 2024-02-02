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
        const result = yield Quiz_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(id) });
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
const add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const result = await Quiz.create(req.body);
    // res.status(201).json(result);
});
const updateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // const result = await Quiz.findByIdAndUpdate(id, req.body);
    // if (!result) {
    //   throw HttpError(404, `Quiz with id=${id} not found`);
    // }
    // res.json(result);
});
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // const result = await Quiz.findByIdAndDelete(id);
    // if (!result) {
    //   throw HttpError(404, `Quiz with id=${id} not found`);
    // }
    // res.json({ message: "Delete success" });
});
exports.default = {
    getAll: (0, index_1.ctrlWrapper)(getAll),
    getAllByRating: (0, index_1.ctrlWrapper)(getAllByRating),
    getQuizeById: (0, index_1.ctrlWrapper)(getQuizeById),
    add: (0, index_1.ctrlWrapper)(add),
    updateById: (0, index_1.ctrlWrapper)(updateById),
    deleteById: (0, index_1.ctrlWrapper)(deleteById),
};
