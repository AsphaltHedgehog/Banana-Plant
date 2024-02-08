"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quizes_controller_1 = __importDefault(require("../../controllers/quizes-controller"));
const index_js_1 = require("../../middlewares/index.js");
const authenticate_1 = __importDefault(require("../../middlewares/authenticate"));
// import { validateBody } from "../../decorators/index.js";
// import { quizAddSchema, quizUpdateSchema } from "../../models/Quizes.js";
const quizRouter = express_1.default.Router();
quizRouter.get("/", quizes_controller_1.default.getAll);
quizRouter.get('/rating', quizes_controller_1.default.getAllByRating);
quizRouter.get('/category', quizes_controller_1.default.getQuizByCategory);
quizRouter.get('/:id', quizes_controller_1.default.getQuizById);
quizRouter.post("/", authenticate_1.default, index_js_1.isEmptyBody, 
// validateBody(quizAddSchema),
quizes_controller_1.default.addNewQuiz);
quizRouter.put('/:id', index_js_1.isEmptyBody, authenticate_1.default, 
// validateBody(quizUpdateSchema),
quizes_controller_1.default.updateQuizById);
quizRouter.delete('/:id', quizes_controller_1.default.deleteQuizById);
exports.default = quizRouter;
