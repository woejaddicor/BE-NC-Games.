const {fetchComments, patchCommentBbyId} = require('../models/comments.model')

exports.getCommentsByReviewer = (req, res, next) => {
    const {review_id} = req.params;
    fetchComments(review_id).then((comments) => {
        res.status(200).send({comments: comments})
    })
    .catch((err) => {
        next(err)
    }
)}

exports.updateComment = (req, res, next) => {
    const voteUpdate = req.body;
    const commentToUpdate = req.params;
    patchCommentBbyId(voteUpdate, commentToUpdate).then((comment) => {
        res.status(200).send({comment: comment})
    })
    .catch((err) => {
        next(err);
    })
}