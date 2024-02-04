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
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
// helpers
const index_1 = require("../helpers/index");
const index_2 = require("../decorators/index");
// models
const QuizQuestion_1 = __importDefault(require("../models/QuizQuestion"));
// import User from '../models/User';
// import Quiz from '../models/Quiz';
const addNewQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, time, imageUrl = '', type, descr, answers, validAnswer } = req.body;
        const arrayOfDescriptions = answers.map((obj) => (Object.assign(Object.assign({}, obj), { id: crypto_1.default.randomUUID().toString() })));
        const validDescr = arrayOfDescriptions[validAnswer].id;
        const quizQuestion = {
            quiz: quizId,
            time,
            imageUrl,
            type,
            descr,
            answers: arrayOfDescriptions,
            validAnswer: validDescr
        };
        yield QuizQuestion_1.default.create(Object.assign({}, quizQuestion));
        res.status(201).json({ quizQuestion });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const updateQuizQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid quiz ID' });
            return;
        }
        const _a = req.body, { _id } = _a, updatedData = __rest(_a, ["_id"]);
        const existingQuiz = yield QuizQuestion_1.default.findByIdAndUpdate(id, updatedData, {
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
const deleteQuizQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw (0, index_1.HttpError)(400, 'Invalid quiz ID');
        }
        const result = yield QuizQuestion_1.default.findByIdAndDelete(id);
        if (!result) {
            throw (0, index_1.HttpError)(404, 'Quiz not found');
        }
        res.status(204).json({ message: 'Quiz deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const deleteQuizQuestionImgById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { id } = req.params;
    // try {
    //     if (!mongoose.Types.ObjectId.isValid(id)) {
    //         throw HttpError(400, 'Invalid quiz ID');
    //     }
    //     const result = await QuizQuestion.findByIdAndDelete(id);
    //     if (!result) {
    //         throw HttpError(404, 'Quiz not found');
    //     }
    res.status(204).json({});
    // } catch (error: any) {
    //     res.status(500).json({ message: error.message });
    // }
});
exports.default = {
    addNewQuizQuestion: (0, index_2.ctrlWrapper)(addNewQuizQuestion),
    updateQuizQuestionById: (0, index_2.ctrlWrapper)(updateQuizQuestionById),
    deleteQuizQuestionById: (0, index_2.ctrlWrapper)(deleteQuizQuestionById),
    deleteQuizQuestionImgById: (0, index_2.ctrlWrapper)(deleteQuizQuestionImgById),
};
