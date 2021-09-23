const {fetchReview, reviewUpdater, fetchAllReviews} = require('../models/reviews.model');

exports.getReviewById = (req, res, next) => {
    const {review_id} = req.params;
    fetchReview(review_id).then((review) => {
        res.status(200).send({review: review})
    })
    .catch((err) => {
        next(err);
    })
}

exports.updateReview = (req, res, next) => {
    const newVotes = req.body.inc_votes;
    const voteToUpdate = req.params.review_id;
    reviewUpdater(newVotes, voteToUpdate).then((updateVote) => {
        res.status(202).send({msg: 'Accepted', vote: updateVote})
    })
    .catch((err) => {
        next(err);
    })
}

exports.getAllReviews = (req, res, next) => {
    const {sort_by, order, category} = req.query;
    fetchAllReviews(sort_by, order, category).then((reviews) => {
        res.status(200).send({reviews: reviews})
    })
}