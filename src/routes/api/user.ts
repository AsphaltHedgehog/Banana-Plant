import express from 'express';
import { userController } from './../../controllers/user';
 import { authenticate } from '../../middlewares';

const userRouter = express.Router();
userRouter.get('/info',
 authenticate, 
 userController.userInfo);

 userRouter.patch('/update',
 authenticate, userController.updateInfo);

userRouter.patch('/favorite',
 authenticate, 
 userController.favorite);



export default userRouter;
