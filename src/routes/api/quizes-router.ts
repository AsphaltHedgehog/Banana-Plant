import express from "express";

import quizController from "../../controllers/quizes-controller";

import {
  isEmptyBody,
} from "../../middlewares/index.js";

import  authenticate  from "../../middlewares/authenticate"

// import { validateBody } from "../../decorators/index.js";

// import { quizAddSchema, quizUpdateSchema } from "../../models/Quizes.js";

const quizRouter = express.Router();

quizRouter.get("/", quizController.getAll);
quizRouter.get('/rating', quizController.getAllByRating);
quizRouter.get('/cat', quizController.getAllCategory);
quizRouter.get('/category', quizController.getQuizByCategory);
quizRouter.get('/:id', quizController.getQuizById);


quizRouter.post(
  "/",
  authenticate,
  isEmptyBody,
  // validateBody(quizAddSchema),
  quizController.addNewQuiz
);

quizRouter.patch(
    '/:id',
    isEmptyBody,
    authenticate,
    // validateBody(quizUpdateSchema),
    quizController.updateQuizById
);

quizRouter.delete('/:id', quizController.deleteQuizById);

export default quizRouter;
