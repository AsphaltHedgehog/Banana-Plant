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
const Review_1 = __importDefault(require("../models/Review"));
const decorators_1 = require("../decorators");
const getReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield Review_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({
        status: 'OK',
        code: 200,
        data: reviews,
    });
});
const addReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, avatarUrl, rating, comment } = req.body;
    // Додаємо відгук
    const newReview = yield Review_1.default.create({
        username,
        avatarUrl,
        rating,
        comment,
    });
    const quizId = res.status(201).json({
        status: 'OK',
        code: 201,
        data: newReview,
    });
});
exports.reviewsController = {
    addReview: (0, decorators_1.ctrlWrapper)(addReview),
    getReviews: (0, decorators_1.ctrlWrapper)(getReviews),
};
// export const addReview = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { username, avatar, rating, comment } = req.body;
//         // Додаємо відгук
//         const newReview = await Review.create({
//             username,
//             avatar,
//             rating,
//             comment,
//         });
//         // Отримуємо тест, для якого додавався відгук
//         // const test = await Test.findOne(/* умова для вибору тесту */);
//         // // Переобчислюємо середній рейтинг тесту
//         // * Закоментувала, бо тесту не існує
//         // test.totalRatings += 1;
//         // test.averageRating = (test.averageRating * (test.totalRatings - 1) + rating) / test.totalRatings;
//         // await test.save();
//         res.status(201).json({
//             status: 'OK',
//             code: 201,
//             data: newReview,
//         });
//     } catch (error) {
//         console.error('Error adding review:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
