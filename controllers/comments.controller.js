const request = require('superagent');
const {fetchComments, patchCommentBbyId, removeCommentById} = require('../models/comments.model')

exports.getAllComments = (req, res, next) => {
    fetchComments().then((comments) => {
        res.status(200).send({comments: comments})
    })
    .catch((err) => {
        next(err)
    }
)}

exports.deleteComment = (req, res, next) => {
    const commentId = req.params;
    removeCommentById(commentId).then((msg) => {
        res.status(204).send()
    })
    .catch((err) => {
        next(err);
    })
}

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