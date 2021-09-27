const {fetchReview, reviewUpdater, fetchAllReviews, fetchReviewIdComments, postComment} = require('../models/reviews.model');

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
        res.status(200).send({msg: 'Accepted', vote: updateVote})
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
    .catch((err) => {
        next(err)
    })
}


exports.getReviewIdComments = (req, res, next) => {
    const {review_id} = req.params;
    fetchReviewIdComments(review_id).then((comments) => {
        res.status(200).send({comments: comments})
    })
    .catch((err) => {
        next(err)
    })
}

// exports.postNewComment = (req, res, next) => {
//     const newComment = req.body;
//     postComment(newComment).then((comment) => {
//         res.status(201).send({comment: comment})
//     })
//     .catch((err) => {
//         next(err);
//     })
// }