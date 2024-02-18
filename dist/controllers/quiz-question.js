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
const Quiz_1 = require("../models/Quiz");
// img handlers
const envConfs_1 = require("../conf/envConfs");
const getAllQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const allQuestions = yield QuizQuestion_1.default.find({ quiz: id });
    res.status(200).json({
        status: 'OK',
        code: 200,
        data: allQuestions,
    });
});
const addNewQuizQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // authenticate
    const user = req.body.user;
    const quiz = yield Quiz_1.Quiz.findById(id);
    if (!quiz) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    if (quiz.owner.toString() !== user._id.toString()) {
        throw (0, index_1.HttpError)(401, "Unauthorized");
    }
    // 
    function answersDefault(req) {
        if (req.body.type === 'true-or-false') {
            return [
                {
                    descr: '',
                },
                {
                    descr: '',
                },
            ];
        }
        else {
            return [
                {
                    descr: '',
                },
                {
                    descr: '',
                },
                {
                    descr: '',
                },
                {
                    descr: '',
                },
            ];
        }
    }
    const answersDefaultArray = answersDefault(req);
    const { time = '0:45', imageUrl = '', type, descr = '', answers = answersDefaultArray, validAnswerIndex, } = req.body;
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
        data: [createdQuizQuestion],
    });
});
const questionImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // authenticate
    const user = req.body.user;
    const quizQuestion = yield QuizQuestion_1.default.findById(id);
    if (!quizQuestion) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    const quiz = yield Quiz_1.Quiz.findById(quizQuestion.quiz);
    if (!quiz) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    if (quiz.owner.toString() !== user._id.toString()) {
        throw (0, index_1.HttpError)(401, "Unauthorized");
    }
    ;
    // work with img
    if (!req.file || !req.file.path) {
        throw (0, index_1.HttpError)(400, 'Bad Request');
    }
    ;
    const cloudinaryUpload = (0, util_1.promisify)(envConfs_1.cloudinary.uploader.upload);
    const result = yield cloudinaryUpload(req.file.path);
    yield promises_1.default.unlink(req.file.path);
    if (!result) {
        throw (0, index_1.HttpError)(500, 'file upload failed');
    }
    const question = yield QuizQuestion_1.default.findByIdAndUpdate(id, { imageUrl: result.public_id }, { new: true });
    if (!question) {
        throw (0, index_1.HttpError)(400, 'question not found');
    }
    const { _id, imageUrl } = question;
    res.status(201).json({
        status: 'OK',
        code: 201,
        data: {
            _id,
            imageUrl,
        },
    });
});
const updateQuizQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Прикрутить авторизацию
    const { id } = req.params;
    // authenticate
    const user = req.body.user;
    const question = yield QuizQuestion_1.default.findById(id);
    if (!question) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    const isQuizExists = yield Quiz_1.Quiz.findById(question.quiz);
    if (!isQuizExists) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    if (isQuizExists.owner.toString() !== user._id.toString()) {
        throw (0, index_1.HttpError)(401, "Unauthorized");
    }
    // 
    const newData = req.body;
    if (newData.answers && newData.validAnswerIndex) {
        newData.validAnswer = newData.answers[newData.validAnswerIndex]._id;
        delete newData.validAnswerIndex;
    }
    else if (newData.validAnswerIndex) {
        const question = yield QuizQuestion_1.default.findById(id);
        if (!question) {
            throw (0, index_1.HttpError)(404, 'Question not found');
        }
        newData.validAnswer = question.answers[req.body.validAnswerIndex]._id;
        delete newData.validAnswerIndex;
    }
    const existingQuiz = yield QuizQuestion_1.default.findByIdAndUpdate(id, Object.assign({}, newData), { new: true });
    if (!existingQuiz) {
        throw (0, index_1.HttpError)(404, 'Bad Request');
    }
    res.status(200).json({
        status: 'OK',
        code: 200,
        data: [existingQuiz],
    });
});
const deleteQuizQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // authenticate
    const user = req.body.user;
    const quizId = yield QuizQuestion_1.default.findById(id);
    if (!quizId) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    const quiz = yield Quiz_1.Quiz.findById(quizId.quiz);
    if (!quiz) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    if (quiz.owner.toString() !== user._id.toString()) {
        throw (0, index_1.HttpError)(401, "Unauthorized");
    }
    // 
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw (0, index_1.HttpError)(400, 'Invalid quiz ID');
    }
    const result = yield QuizQuestion_1.default.findByIdAndDelete(id);
    if (!result) {
        throw (0, index_1.HttpError)(404, 'Quiz not found');
    }
    res.status(204).json({});
});
const deleteQuizQuestionImgById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // authenticate
    const user = req.body.user;
    const quizQuestion = yield QuizQuestion_1.default.findById(id);
    if (!quizQuestion) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    const quiz = yield Quiz_1.Quiz.findById(quizQuestion.quiz);
    if (!quiz) {
        throw (0, index_1.HttpError)(400, "Bad Request");
    }
    ;
    if (quiz.owner.toString() !== user._id.toString()) {
        throw (0, index_1.HttpError)(401, "Unauthorized");
    }
    // 
    const question = yield QuizQuestion_1.default.findByIdAndUpdate(id, { imageUrl: '' });
    if (!question) {
        throw (0, index_1.HttpError)(404, 'Question not found');
    }
    if (question.imageUrl === '') {
        throw (0, index_1.HttpError)(404, 'Image not found');
    }
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
