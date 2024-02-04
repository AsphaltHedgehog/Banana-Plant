"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quizes_controller_js_1 = __importDefault(require("../../controllers/quizes-controller.js"));
const index_js_1 = require("../../middlewares/index.js");
// import { validateBody } from "../../decorators/index.js";
// import { quizAddSchema, quizUpdateSchema } from "../../models/Quizes.js";
const quizesRouter = express_1.default.Router();
quizesRouter.get("/", quizes_controller_js_1.default.getAll);
quizesRouter.get('/rating', quizes_controller_js_1.default.getAllByRating);
quizesRouter.get('/category', quizes_controller_js_1.default.getQuizesByCategory);
quizesRouter.get('/:id', quizes_controller_js_1.default.getQuizeById);
quizesRouter.post("/", 
// upload.single("poster"),
index_js_1.isEmptyBody, 
// validateBody(quizAddSchema),
quizes_controller_js_1.default.addNewQuize);
quizesRouter.put('/:id', index_js_1.isEmptyBody, 
// validateBody(quizUpdateSchema),
quizes_controller_js_1.default.updateQuizeById);
quizesRouter.delete('/:id', quizes_controller_js_1.default.deleteQuizeById);
exports.default = quizesRouter;
