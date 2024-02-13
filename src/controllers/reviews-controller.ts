import { Request, Response } from 'express';
import gravatar from 'gravatar';

import Review from '../models/Review';
import { ctrlWrapper } from '../decorators';
import { Quiz } from '../models/Quiz';

const getReviews = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 6 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const reviews = await Review.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string));

    res.status(200).json({
        status: 'OK',
        code: 200,
        data: reviews,
    });
};

const addReview = async (req: Request, res: Response): Promise<void> => {
    const { userName, rating, review } = req.body;

    const quizId = req.params.id;
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

    const avatarUrl = gravatar.url(userName, {
        s: '200',
        r: 'pg',
        d: 'identicon',
    });

    const newReview = await Review.create({
        userName,
        review,
        avatarUrl,
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
