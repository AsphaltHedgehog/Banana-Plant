import express from "express";

import quizesController from "../../controllers/quizes-controller.js";

import {
  isEmptyBody, //upload 
} from "../../middlewares/index.js";

// import { validateBody } from "../../decorators/index.js";

// import { quizAddSchema, quizUpdateSchema } from "../../models/Quizes.js";

const quizesRouter = express.Router();

quizesRouter.get("/", quizesController.getAll);
quizesRouter.get('/rating', quizesController.getAllByRating);
quizesRouter.get('/category', quizesController.getQuizesByCategory);
quizesRouter.get('/:id', quizesController.getQuizeById);


quizesRouter.post(
  "/",
<<<<<<< Updated upstream
  // upload.single("poster"),
  isEmptyBody,
=======
  // authenticate,
  // isEmptyBody,
>>>>>>> Stashed changes
  // validateBody(quizAddSchema),
  quizesController.addNewQuize
);

<<<<<<< Updated upstream
quizesRouter.put(
=======
quizRouter.patch(
>>>>>>> Stashed changes
    '/:id',
    isEmptyBody,
    // validateBody(quizUpdateSchema),
    quizesController.updateQuizeById
);

quizesRouter.delete('/:id', quizesController.deleteQuizeById);

export default quizesRouter;
