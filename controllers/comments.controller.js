const {fetchComments} = require('../models/comments.model')

exports.getCommentsByReviewer = (req, res, next) => {
    const {review_id} = req.params;
    fetchComments(review_id).then((comments) => {
        res.status(200).send({comments: comments})
    })
    .catch((err) => {
        next(err)
    }
)}