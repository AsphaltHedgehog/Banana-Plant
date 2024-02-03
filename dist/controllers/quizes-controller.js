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
const index_1 = require("../helpers/index");
const index_2 = require("../decorators/index");
const mongoose_1 = __importDefault(require("mongoose"));
const promises_1 = __importDefault(require("fs/promises"));
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Quiz_1.default.find({}, '-createdAt -updatedAt');
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
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
        const result = yield Quiz_1.default.findOne({
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
const addNewQuize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.body;
        if (!req.file || !req.file.path) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const { url: poster } = yield index_1.cloudinary.uploader.upload(req.file.path, {
            folder: 'posters',
        });
        yield promises_1.default.unlink(req.file.path);
        if (!mongoose_1.default.Types.ObjectId.isValid(category)) {
            res.status(400).json({ error: 'Invalid category ID' });
            return;
        }
        const categoryObjectId = new mongoose_1.default.Types.ObjectId(category);
        const newQuize = new Quiz_1.default(Object.assign(Object.assign({}, req.body), { category: categoryObjectId, poster }));
        const quize = yield newQuize.save();
        res.status(201).json(newQuize);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const updateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () { });
const deleteQuizeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw (0, index_1.HttpError)(400, 'Invalid quiz ID');
            return;
        }
        const result = yield Quiz_1.default.findByIdAndDelete(id);
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
    addNewQuize: (0, index_2.ctrlWrapper)(addNewQuize),
    updateById: (0, index_2.ctrlWrapper)(updateById),
    deleteQuizeById: (0, index_2.ctrlWrapper)(deleteQuizeById),
};
