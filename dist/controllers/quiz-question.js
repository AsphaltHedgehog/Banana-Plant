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
// import crypto from 'crypto';
// helpers
const index_1 = require("../helpers/index");
const index_2 = require("../decorators/index");
// models
const QuizQuestion_1 = __importDefault(require("../models/QuizQuestion"));
// import User from '../models/User';
// import Quiz from '../models/Quiz';
const addNewQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quizId, time, imageUrl = '', type, descr, answers, validAnswer = '75b9b74a5af6ce975d92ee51', validAnswerIndex } = req.body;
        // auth (Пока закоменчено чтобы не ломать ничего)
        // const user = req.body.user
        // const quiz = await Quiz.findById(quizId);
        // if (!quiz ) {
        //   throw HttpError(400, "Bad Request")
        // };
        // Уточнить момент где будет храниться владелец Теста, в самом Тесте или в Юзере!?
        // if (!user.ownTests.find(quizId)) {
        //   throw HttpError(401, "Unauthorized")
        // }
        // НЕНУЖНАЯ СЕКЦИЯ!!!!
        // generate answers id's, amd set validAnswer
        //   interface DescriptionObject {
        //   descr: string;
        //   }
        //   const arrayOfDescriptions = answers.map((obj: DescriptionObject) => ({
        //       ...(obj as DescriptionObject),
        //       id: crypto.randomUUID().toString()
        //   }));
        //   const validDescr = arrayOfDescriptions[validAnswer].id
        // НЕНУЖНАЯ СЕКЦИЯ!!!!
        // const quizQuestion = new QuizQuestion ({
        //     quiz: quizId,
        //     time: time,
        //     answers: answers,
        //     imageUrl: imageUrl,
        //     type: type,
        //     descr: descr,
        //     validAnswer: answers[validAnswerIndex]._id,
        // });
        const quizQuestion = {
            quiz: quizId,
            time: time,
            answers: answers,
            imageUrl: imageUrl,
            type: type,
            descr: descr,
            validAnswer: answers[validAnswerIndex]._id,
        };
        console.log(quizQuestion, validAnswerIndex);
        const createdQuizQuestion = yield QuizQuestion_1.default.create(quizQuestion);
        res.status(201).json({ createdQuizQuestion });
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
