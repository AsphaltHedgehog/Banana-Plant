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
exports.addReview = void 0;
const Review_1 = __importDefault(require("../models/Review"));
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, avatar, rating, comment } = req.body;
        // Додаємо відгук
        const newReview = yield Review_1.default.create({ username, avatar, rating, comment });
        // Отримуємо тест, для якого додавався відгук
        const test = yield Test.findOne( /* умова для вибору тесту */);
        // Переобчислюємо середній рейтинг тесту
        test.totalRatings += 1;
        test.averageRating = (test.averageRating * (test.totalRatings - 1) + rating) / test.totalRatings;
        yield test.save();
        res.status(201).json({
            status: 'OK',
            code: 201,
            data: newReview,
        });
    }
    catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.addReview = addReview;
