import express from 'express';
import { userController } from './../../controllers/user';
import { authenticate, upload } from '../../middlewares';

const userRouter = express.Router();

userRouter.get('/info', authenticate, userController.userInfo);

userRouter.patch('/update', authenticate, userController.updateInfo);

userRouter.patch('/favorite', authenticate, userController.favorite);

userRouter.patch(
    '/update/avatarURL',
    upload.single('userAvatar'),
    authenticate,
    userController.updateAvatar
);

userRouter.patch('/passed-quiz', authenticate, userController.addPassedQuiz);

userRouter.patch(
    '/retake-passed-quiz',
    authenticate,
    userController.updatePassedQuiz
);

export default userRouter;
