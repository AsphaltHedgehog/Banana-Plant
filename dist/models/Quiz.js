"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizUpdateFavoriteSchema = exports.quizUpdateSchema = exports.quizAddSchema = void 0;
const mongoose_1 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const hooks_js_1 = require("./hooks.js");
const quizSchema = new mongoose_1.Schema({
    theme: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    background: {
        type: String,
    },
    ageGroup: {
        type: String,
        required: true,
    },
    ratingQuantity: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    finished: {
        type: Number,
        required: true,
    },
}, { versionKey: false, timestamps: true });
quizSchema.post("save", hooks_js_1.handleSaveError);
quizSchema.pre("findOneAndUpdate", hooks_js_1.addUpdateSetting);
quizSchema.post("findOneAndUpdate", hooks_js_1.handleSaveError);
exports.quizAddSchema = joi_1.default.object({
    theme: joi_1.default.string().required(),
    category: joi_1.default.string().required(),
    background: joi_1.default.string(),
    ageGroup: joi_1.default.string().required(),
    ratingQuantity: joi_1.default.number().required(),
    rating: joi_1.default.number().required(),
    finished: joi_1.default.number().required(),
});
exports.quizUpdateSchema = joi_1.default.object({
    theme: joi_1.default.string(),
    category: joi_1.default.string(),
    background: joi_1.default.string(),
    ageGroup: joi_1.default.string(),
    ratingQuantity: joi_1.default.number(),
    rating: joi_1.default.number(),
    finished: joi_1.default.number(),
});
exports.quizUpdateFavoriteSchema = joi_1.default.object({});
const Quiz = (0, mongoose_1.model)("quizes", quizSchema);
exports.default = Quiz;
