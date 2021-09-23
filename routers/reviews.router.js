const express = require('express');
const {getReviewById, updateReview, getAllReviews}  = require('../controllers/reviews.controller')

const reviewsRouter = express.Router();

reviewsRouter.get('/:review_id', getReviewById);
reviewsRouter.get('/', getAllReviews);
reviewsRouter.patch('/:review_id', updateReview);

module.exports = reviewsRouter;