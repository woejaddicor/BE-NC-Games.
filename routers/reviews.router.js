const express = require('express');
const {getReviewById, updateReview, getAllReviews, getReviewIdComments, postNewComment}  = require('../controllers/reviews.controller')

const reviewsRouter = express.Router();

reviewsRouter.get('/:review_id', getReviewById);
reviewsRouter.get('/', getAllReviews);
reviewsRouter.patch('/:review_id', updateReview);
reviewsRouter.get('/:review_id/comments', getReviewIdComments);
// reviewsRouter.post('/:review_id/comments', postNewComment);

module.exports = reviewsRouter;