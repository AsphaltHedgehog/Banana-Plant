"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./../../controllers/user");
const middlewares_1 = require("../../middlewares");
const userRouter = express_1.default.Router();
userRouter.get('/info', middlewares_1.authenticate, user_1.userController.userInfo);
userRouter.patch('/update', middlewares_1.authenticate, user_1.userController.updateInfo);
userRouter.patch('/favorite', middlewares_1.authenticate, user_1.userController.favorite);
userRouter.patch('/update/avatarURL', middlewares_1.upload.single('userAvatar'), middlewares_1.authenticate, user_1.userController.updateAvatar);
userRouter.patch('/passed-quiz', middlewares_1.authenticate, user_1.userController.addPassedQuiz);
userRouter.patch('/retake-passed-quiz', middlewares_1.authenticate, user_1.userController.updatePassedQuiz);
exports.default = userRouter;
