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
const mongoose_1 = __importStar(require("mongoose"));
// helpers
const index_1 = require("../helpers/index");
const index_2 = require("../decorators/index");
// models
const QuizQuestion_1 = __importDefault(require("../models/QuizQuestion"));
// import User from '../models/User';
// import Quiz from '../models/Quiz';
const addNewQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, time, imageUrl = '', type, descr, answers, validAnswerIndex } = req.body;
        ;
        const arrayOfDescriptions = answers.map((obj) => (Object.assign(Object.assign({}, obj), { _id: new mongoose_1.Types.ObjectId() })));
        const validAnswerId = arrayOfDescriptions[validAnswerIndex]._id;
        const quizQuestion = {
            quiz: quizId,
            time: time,
            answers: arrayOfDescriptions,
            imageUrl: imageUrl,
            type: type,
            descr: descr,
            validAnswer: validAnswerId,
        };
        console.log();
        const createdQuizQuestion = yield QuizQuestion_1.default.create(quizQuestion);
        res.status(201).json({ createdQuizQuestion });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
const updateQuizQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Прикрутить авторизацию
    const { id } = req.params;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw (0, index_1.HttpError)(404, "Bad Request");
        }
        const newData = req.body;
        if (newData.answers & newData.validAnswerIndex) {
            ;
            const arrayOfDescriptions = newData.answers.map((obj) => (Object.assign(Object.assign({}, obj), { _id: new mongoose_1.Types.ObjectId() })));
            newData.answers = arrayOfDescriptions;
            delete newData.validAnswerIndex;
            newData.validAnswer = arrayOfDescriptions[newData.validAnswerIndex]._id;
        }
        ;
        const existingQuiz = yield QuizQuestion_1.default.findByIdAndUpdate(id, newData, { new: true });
        if (!existingQuiz) {
            throw (0, index_1.HttpError)(404, "Bad Request");
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
    const { id } = req.params;
    // Прикрути аутефикацию)
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw (0, index_1.HttpError)(400, 'Invalid quiz ID');
        }
        const result = yield QuizQuestion_1.default.findByIdAndDelete(id);
        if (!result) {
            throw (0, index_1.HttpError)(404, 'Quiz not found');
        }
        res.status(204).json({});
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.default = {
    addNewQuizQuestion: (0, index_2.ctrlWrapper)(addNewQuizQuestion),
    updateQuizQuestionById: (0, index_2.ctrlWrapper)(updateQuizQuestionById),
    deleteQuizQuestionById: (0, index_2.ctrlWrapper)(deleteQuizQuestionById),
    deleteQuizQuestionImgById: (0, index_2.ctrlWrapper)(deleteQuizQuestionImgById),
};
