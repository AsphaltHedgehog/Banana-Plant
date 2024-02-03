"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
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
// export const quizAddSchema = Joi.object({
//   theme: Joi.string().required(),
//   category: Joi.string().required(),
//   background: Joi.string(),
//   ageGroup: Joi.string().required(),
//   ratingQuantity: Joi.number().required(),
//   rating: Joi.number().required(),
//   finished: Joi.number().required(),
// });
// export const quizUpdateSchema = Joi.object({
//   theme: Joi.string(),
//   category: Joi.string(),
//   background: Joi.string(),
//   ageGroup: Joi.string(),
//   ratingQuantity: Joi.number(),
//   rating: Joi.number(),
//   finished: Joi.number(),
// });
// export const quizUpdateFavoriteSchema = Joi.object({});
const Quiz = (0, mongoose_1.model)("quizes", quizSchema);
exports.default = Quiz;
