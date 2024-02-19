import express from 'express';

import quizController from '../../controllers/quizes-controller';

import { isEmptyBody } from '../../middlewares/index.js';

import authenticate from '../../middlewares/authenticate';

const quizRouter = express.Router();

quizRouter.get('/', quizController.getAll);
quizRouter.get('/category/all', quizController.getCategory);
quizRouter.get('/rating', quizController.getAllByRating);
quizRouter.get('/cat', quizController.getAllCategory);
quizRouter.get('/category', quizController.getQuizByCategory);
quizRouter.get('/favorites', authenticate, quizController.getFavoritesQuizes);
quizRouter.get('/myQuizes', authenticate, quizController.getMyQuizes);
quizRouter.get('/:id', quizController.getQuizById);

quizRouter.post(
    '/',
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
