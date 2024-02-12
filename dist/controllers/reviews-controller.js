"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewsController = void 0;
const gravatar_1 = __importDefault(require("gravatar"));
const Review_1 = __importDefault(require("../models/Review"));
const decorators_1 = require("../decorators");
const Quiz_1 = require("../models/Quiz");
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, limit = 6 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reviews = yield Review_1.default.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
    res.status(200).json({
        status: 'OK',
        code: 200,
        data: reviews,
    });
});
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, rating, review } = req.body;
    const quizId = req.params.id;
    const quiz = yield Quiz_1.Quiz.findById(quizId);
    if (!quiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }
    const newRatingQuantity = quiz.ratingQuantity ? quiz.ratingQuantity + 1 : 1;
    const newQuizRating = ((quiz.rating || 0) * (quiz.ratingQuantity || 0) + rating) /
        newRatingQuantity;
    yield Quiz_1.Quiz.findByIdAndUpdate(quizId, {
        rating: newQuizRating,
        ratingQuantity: newRatingQuantity,
    });
    const avatarUrl = gravatar_1.default.url(email, {
        s: '200',
        r: 'pg',
        d: 'identicon',
    });
    const newReview = yield Review_1.default.create({
        userName,
        review,
        avatarUrl,
    });
    res.status(201).json({
        status: 'OK',
        code: 201,
        data: newReview,
    });
});
exports.reviewsController = {
    addReview: (0, decorators_1.ctrlWrapper)(addReview),
    getReviews: (0, decorators_1.ctrlWrapper)(getReviews),
};
