const fetchComments = require('../models/comments.model')

exports.getCommentsByReviewer = (req, res, next) => {
    fetchComments().then((comments) => {
        res.status(200).send({comments: comments})
    })
}