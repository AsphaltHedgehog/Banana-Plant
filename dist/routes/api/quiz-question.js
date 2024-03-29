"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_question_js_1 = __importDefault(require("../../controllers/quiz-question.js"));
const index_js_1 = require("../../middlewares/index.js");
const quizQuestionRoute = express_1.default.Router();
quizQuestionRoute.get("/:id", quiz_question_js_1.default.getAllQuestions);
quizQuestionRoute.post("/:id", index_js_1.isEmptyBody, index_js_1.authenticate, quiz_question_js_1.default.addNewQuizQuestion);
quizQuestionRoute.patch("/img/:id", index_js_1.upload.single("questionPoster"), index_js_1.authenticate, quiz_question_js_1.default.questionImg);
quizQuestionRoute.patch('/:id', index_js_1.isEmptyBody, index_js_1.authenticate, quiz_question_js_1.default.updateQuizQuestionById);
quizQuestionRoute.delete('/:id', index_js_1.authenticate, quiz_question_js_1.default.deleteQuizQuestionById);
quizQuestionRoute.delete('/img/:id', index_js_1.authenticate, quiz_question_js_1.default.deleteQuizQuestionImgById);
exports.default = quizQuestionRoute;
