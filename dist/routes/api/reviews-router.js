"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_controller_1 = require("../../controllers/reviews-controller");
const reviewsRouter = (0, express_1.Router)();
reviewsRouter.get('/', reviews_controller_1.reviewsController.addReview);
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
exports.default = reviewsRouter;
