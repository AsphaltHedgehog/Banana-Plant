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
    const { userName, email, rating, review } = req.body;

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

    const avatarUrl = gravatar.url(email, {
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