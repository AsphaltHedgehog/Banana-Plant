import express from "express";

import quizController from "../../controllers/quizes-controller";

import {
  isEmptyBody, //upload 
} from "../../middlewares/index";

// import { validateBody } from "../../decorators/index.js";

// import { quizAddSchema, quizUpdateSchema } from "../../models/Quizes.js";

const quizRouter = express.Router();

quizRouter.get("/", quizController.getAll);
quizRouter.get('/rating', quizController.getAllByRating);
quizRouter.get('/category', quizController.getQuizesByCategory);
quizRouter.get('/:id', quizController.getQuizeById);


quizRouter.post(
  "/",
  // authenticate,
  // isEmptyBody,
  // validateBody(quizAddSchema),
  quizController.addNewQuize
);


quizRouter.patch(
    '/:id',
    isEmptyBody,
    // validateBody(quizUpdateSchema),
    quizController.updateQuizeById
);

quizRouter.delete('/:id', quizController.deleteQuizeById);

export default quizRouter;
