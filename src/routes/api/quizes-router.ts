import express from "express";

import quizesController from "../../controllers/quizes-controller.js";

import { isEmptyBody } from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

// import { quizAddSchema, quizUpdateSchema } from "../../models/Quizes.js";

const quizesRouter = express.Router();

quizesRouter.get("/", quizesController.getAll);
quizesRouter.get('/rating', quizesController.getAllByRating);
quizesRouter.get('/:id', quizesController.getQuizeById);

quizesRouter.post(
  "/",
  isEmptyBody,
  // validateBody(quizAddSchema),
  quizesController.addNewQuize
);

quizesRouter.put(
  "/:id",
  isEmptyBody,
  // validateBody(quizUpdateSchema),
  quizesController.updateById
);

quizesRouter.delete('/:id', quizesController.deleteQuizeById);

export default quizesRouter;
