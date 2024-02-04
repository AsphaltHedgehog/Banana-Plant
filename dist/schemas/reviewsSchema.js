"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const reviewsSchema = joi_1.default.object({
    rating: joi_1.default.number()
        .required()
        .min(1)
        .max(5)
        .messages({ 'any.required': 'missing required rating field, *(1-5)' }),
    comment: joi_1.default.string()
        .required()
        .messages({ 'any.required': 'missing required comment field, *(any string)' }),
});
exports.default = { reviewsSchema };
