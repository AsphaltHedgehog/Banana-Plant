import { Router } from "express";

import reviewsController from "../../controllers/reviews-controller";
// import authenticate from "../../middlewares/";
import reviewsValidation from "../../middlewares/reviews-validation.js";

const reviewsRouter = Router();

reviewsRouter.get("/",
  reviewsController.getAllReviews);

// reviewsRouter.get("/own",
//   authenticate,
//   reviewsController.getOneReview);

// reviewsRouter.post("/own",
//   authenticate,
//   reviewsValidation.addReviewValidate,
//   reviewsController.addOneReview);

// reviewsRouter.patch("/own",
//   authenticate,
//   reviewsValidation.updateReviewValidate,
//   reviewsController.updateOneReview);

// reviewsRouter.delete("/own",
//   authenticate,
//   reviewsController.removeOneReview);

export default reviewsRouter;


