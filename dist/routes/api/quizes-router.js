"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quizes_controller_js_1 = __importDefault(require("../../controllers/quizes-controller.js"));
const index_js_1 = require("../../middlewares/index.js");
// import { quizAddSchema, quizUpdateSchema } from "../../models/Quiz.js";
const quizesRouter = express_1.default.Router();
quizesRouter.get("/", quizes_controller_js_1.default.getAll);
quizesRouter.get("/:id", quizes_controller_js_1.default.getById);
quizesRouter.post("/", index_js_1.isEmptyBody, 
// validateBody(quizAddSchema),
quizes_controller_js_1.default.add);
quizesRouter.put("/:id", index_js_1.isEmptyBody, 
// validateBody(quizUpdateSchema),
quizes_controller_js_1.default.updateById);
quizesRouter.delete("/:id", quizes_controller_js_1.default.deleteById);
exports.default = quizesRouter;
