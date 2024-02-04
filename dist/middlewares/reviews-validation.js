"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validateBody_1 = __importDefault(require("../decorators/validateBody"));
const reviewsSchema_1 = __importDefault(require("../schemas/reviewsSchema"));
const addReviewValidate = (0, validateBody_1.default)(reviewsSchema_1.default.reviewsSchema);
const updateReviewValidate = (0, validateBody_1.default)(reviewsSchema_1.default.reviewsSchema);
exports.default = {
    addReviewValidate,
    updateReviewValidate,
};
