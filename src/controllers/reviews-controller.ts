import { Request, Response } from 'express';
import Review from '../models/Review';


export const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, avatar, rating, comment } = req.body;

    // Додаємо відгук
    const newReview = await Review.create({ username, avatar, rating, comment });
    
    // Отримуємо тест, для якого додавався відгук
    const test = await Test.findOne(/* умова для вибору тесту */);

    // Переобчислюємо середній рейтинг тесту
    test.totalRatings += 1;
    test.averageRating = (test.averageRating * (test.totalRatings - 1) + rating) / test.totalRatings;

    await test.save();

    res.status(201).json({
      status: 'OK',
      code: 201,
      data: newReview,
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
