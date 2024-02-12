import express from "express";

import quizQuestion from "../../controllers/quiz-question.js";

import {
  authenticate,
  isEmptyBody, upload
} from "../../middlewares/index.js";

const quizQuestionRoute = express.Router();

quizQuestionRoute.get("/:id",
  quizQuestion.getAllQuestions);

quizQuestionRoute.post("/:id", isEmptyBody, authenticate,
  quizQuestion.addNewQuizQuestion);

quizQuestionRoute.patch("/img/:id", authenticate, 
  upload.single("questionPoster"),
  quizQuestion.questionImg);

quizQuestionRoute.patch('/:id', isEmptyBody, authenticate,
  quizQuestion.updateQuizQuestionById);

quizQuestionRoute.delete('/:id', authenticate,
  quizQuestion.deleteQuizQuestionById);

quizQuestionRoute.delete('/img/:id', authenticate,
  quizQuestion.deleteQuizQuestionImgById);

export default quizQuestionRoute;
