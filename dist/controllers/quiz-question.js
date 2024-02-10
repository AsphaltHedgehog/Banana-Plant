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
const promises_1 = __importDefault(require("fs/promises"));
const util_1 = require("util");
// helpers
const index_1 = require("../helpers/index");
const index_2 = require("../decorators/index");
// models
const QuizQuestion_1 = __importDefault(require("../models/QuizQuestion"));
// import User from '../models/User';
// import Quiz from '../models/Quiz';
// img handlers
const envConfs_1 = require("../conf/envConfs");
const getAllQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const allQuestions = yield QuizQuestion_1.default.find({ quiz: id });
    res.status(200).json({
        status: 'OK',
        code: 200,
        data: allQuestions
    });
});
const addNewQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { time, imageUrl = '', type, descr, answers, validAnswerIndex } = req.body;
    ;
    const arrayOfDescriptions = answers.map((obj) => (Object.assign(Object.assign({}, obj), { _id: new mongoose_1.Types.ObjectId() })));
    const validAnswerId = arrayOfDescriptions[validAnswerIndex]._id;
    const quizQuestion = {
        quiz: id,
        time: time,
        answers: arrayOfDescriptions,
        imageUrl: imageUrl,
        type: type,
        descr: descr,
        validAnswer: validAnswerId,
    };
    const createdQuizQuestion = yield QuizQuestion_1.default.create(quizQuestion);
    res.status(201).json({
        status: 'OK',
        code: 201,
        data: Object.assign({}, createdQuizQuestion)
    });
});
const questionImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
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
    // work with img
    if (!req.file || !req.file.path) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    const cloudinaryUpload = (0, util_1.promisify)(envConfs_1.cloudinary.uploader.upload);
    const result = yield cloudinaryUpload(req.file.path);
    yield promises_1.default.unlink(req.file.path);
    if (!result) {
        throw (0, index_1.HttpError)(500, 'file upload failed');
    }
    ;
    const question = yield QuizQuestion_1.default.findByIdAndUpdate(id, { imageUrl: result.public_id }, { new: true });
    if (!question) {
        throw (0, index_1.HttpError)(400, 'question not found');
    }
    ;
    const { _id, imageUrl } = question;
    res.status(201).json({
        status: 'OK',
        code: 201,
        data: {
            _id,
            imageUrl
        }
    });
});
const updateQuizQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Прикрутить авторизацию
    const { id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, index_1.HttpError)(400, 'Invalid quiz ID');
    }
    // auth (Пока закоменчено чтобы не ломать ничего)
    // const user = req.body.user
    // const quiz = await Quiz.findById(id);
    // if (!quiz ) {
    //   throw HttpError(400, "Bad Request")
    // };
    // Уточнить момент где будет храниться владелец Теста, в самом Тесте или в Юзере!?
    // if (!user.ownTests.find(quizId)) {
    //   throw HttpError(401, "Unauthorized")
    // }
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
    res.status(200).json({
        status: 'OK',
        code: 200,
        data: Object.assign({}, existingQuiz)
    });
});
const deleteQuizQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
        throw (0, index_1.HttpError)(400, 'Invalid quiz ID');
    }
    const result = yield QuizQuestion_1.default.findByIdAndDelete(_id);
    if (!result) {
        throw (0, index_1.HttpError)(404, 'Quiz not found');
    }
    res.status(204).json({});
});
const deleteQuizQuestionImgById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    // Прикрути аутефикацию)
    // auth (Пока закоменчено чтобы не ломать ничего)
    // const user = req.body.user
    // const quiz = await Quiz.findById(id);
    // if (!quiz) {
    //   throw HttpError(400, "Bad Request")
    // };
    // Уточнить момент где будет храниться владелец Теста, в самом Тесте или в Юзере!?
    // if (!user.ownTests.find(quizId)) {
    //   throw HttpError(401, "Unauthorized")
    // }
    if (!mongoose_1.default.Types.ObjectId.isValid(_id)) {
        throw (0, index_1.HttpError)(400, 'Invalid quiz ID');
    }
    const question = yield QuizQuestion_1.default.findByIdAndUpdate(_id, { imageUrl: '' });
    console.log(question);
    if (!question) {
        throw (0, index_1.HttpError)(404, 'Question not found');
    }
    if (question.imageUrl === '') {
        throw (0, index_1.HttpError)(404, 'Image not found');
    }
    console.log(question.imageUrl);
    const cloudinaryDeletion = (0, util_1.promisify)(envConfs_1.cloudinary.uploader.destroy);
    const result = yield cloudinaryDeletion(question.imageUrl);
    if (!result) {
        throw (0, index_1.HttpError)(500, 'Image deletion failed');
    }
    res.status(204).json({});
});
exports.default = {
    getAllQuestions: (0, index_2.ctrlWrapper)(getAllQuestions),
    addNewQuizQuestion: (0, index_2.ctrlWrapper)(addNewQuizQuestion),
    updateQuizQuestionById: (0, index_2.ctrlWrapper)(updateQuizQuestionById),
    deleteQuizQuestionById: (0, index_2.ctrlWrapper)(deleteQuizQuestionById),
    deleteQuizQuestionImgById: (0, index_2.ctrlWrapper)(deleteQuizQuestionImgById),
    questionImg: (0, index_2.ctrlWrapper)(questionImg),
};
