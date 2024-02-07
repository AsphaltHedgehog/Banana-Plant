import { Request, Response } from 'express';
import gravatar from 'gravatar';

import Review from '../models/Review';
import { ctrlWrapper } from '../decorators';
import { Quiz } from '../models/Quiz';

const getReviews = async (req: Request, res: Response): Promise<void> => {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.status(200).json({
        status: 'OK',
        code: 200,
        data: reviews,
    });
};

const addReview = async (req: Request, res: Response): Promise<void> => {
    const { username, email, rating, comment } = req.body;

    const quizId = req.body._id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
        res.status(404).json({ error: 'Quiz not found' });
        return;
    }

    const newRatingQuantity = quiz.ratingQuantity ? quiz.ratingQuantity + 1 : 1;
    const newQuizRating =
        ((quiz.rating || 0) * (quiz.ratingQuantity || 0) + rating) /
        newRatingQuantity;

    await Quiz.findByIdAndUpdate(quizId, {
        rating: newQuizRating,
        ratingQuantity: newRatingQuantity,
    });

    const avatarUrl = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'identicon',
    });

    const newReview = await Review.create({
        username,
        avatarUrl,
        rating,
        comment,
    });

    res.status(201).json({
        status: 'OK',
        code: 201,
        data: newReview,
    });
};

export const reviewsController = {
    addReview: ctrlWrapper(addReview),
    getReviews: ctrlWrapper(getReviews),
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

//   const { username, email, rating, comment } = req.body;
// const quizId = req.body._id;
// const quiz = await Quiz.findById(quizId);

//   // if (!quiz) {
//   //     res.status(404).json({ error: 'Quiz not found' });
//   //     return;
//   // }

//   const newRatingQuantity = quiz.ratingQuantity ? quiz.ratingQuantity + 1 : 1;
//   const newQuizRating =
//       ((quiz.rating || 0) * (quiz.ratingQuantity || 0) + rating) /
//       newRatingQuantity;

//   await Quiz.findByIdAndUpdate(quizId, {
//       rating: newQuizRating,
//       ratingQuantity: newRatingQuantity,
//   });

//   const avatarUrl = gravatar.url(email, {
//       s: '200',
//       r: 'pg',
//       d: 'identicon',
//   });

//   const newReview = await Review.create({
//       username,
//       avatarUrl,
//       rating,
//       comment,
//   });

//   res.status(201).json({
//       status: 'OK',
//       code: 201,
//       data: newReview,
//   });
