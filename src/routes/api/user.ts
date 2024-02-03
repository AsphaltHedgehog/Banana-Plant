import express from 'express';
import { ctrl } from './../../controllers/auth';
import { authenticate } from '../../middlewares';

const userRouter = express.Router();

userRouter.patch('/favorite',authenticate, ctrl.register);



export default userRouter;
