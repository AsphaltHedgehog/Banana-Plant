"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_controller_1 = require("../../controllers/reviews-controller");
const reviewsRouter = (0, express_1.Router)();
reviewsRouter.get('/getReviews', reviews_controller_1.reviewsController.getReviews);
reviewsRouter.post('/:id/addReview', reviews_controller_1.reviewsController.addReview);
exports.default = reviewsRouter;
