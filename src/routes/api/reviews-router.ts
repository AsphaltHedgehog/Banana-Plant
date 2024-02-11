import { Router } from 'express';

import { reviewsController } from '../../controllers/reviews-controller';
import reviewsValidation from '../../middlewares/reviews-validation.js';

const reviewsRouter = Router();

reviewsRouter.get('/getReviews', reviewsController.getReviews);

reviewsRouter.post('/:id/addReview', reviewsController.addReview);

export default reviewsRouter;
