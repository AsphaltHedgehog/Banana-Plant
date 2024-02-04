import express from "express";

import quizQuestion from "../../controllers/quiz-question.js";

import { isEmptyBody } from "../../middlewares/index.js";

// Пока не добавляю аутефикацию чтобы фронту было удобнее работать
// import { authenticate } from '../../middlewares';

const quizQuestionRoute = express.Router();

quizQuestionRoute.post("/", isEmptyBody, //authenticate,
  quizQuestion.addNewQuizQuestion);

quizQuestionRoute.patch('/:id', isEmptyBody, //authenticate,
  quizQuestion.updateQuizQuestionById);

quizQuestionRoute.delete('/:id', //authenticate,
  quizQuestion.deleteQuizQuestionById);

quizQuestionRoute.delete('/img/:id', //authenticate,
  quizQuestion.deleteQuizQuestionImgById);

export default quizQuestionRoute;
