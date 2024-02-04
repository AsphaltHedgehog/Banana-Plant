"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_controller_1 = __importDefault(require("../../controllers/reviews-controller"));
const reviewsRouter = (0, express_1.Router)();
reviewsRouter.get("/", reviews_controller_1.default.getAllReviews);
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
