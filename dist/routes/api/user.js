"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./../../controllers/auth");
const middlewares_1 = require("../../middlewares");
const userRouter = express_1.default.Router();
userRouter.patch('/favorite', middlewares_1.authenticate, auth_1.ctrl.register);
exports.default = userRouter;
