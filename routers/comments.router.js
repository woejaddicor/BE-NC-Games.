const express = require('express');
const { getCommentsByReviewer, updateComment, deleteComment } = require('../controllers/comments.controller');

const commentsRouter = express.Router();

commentsRouter.get('/:review_id', getCommentsByReviewer);
commentsRouter.patch('/:comment_id', updateComment);
commentsRouter.delete('/:comment_id', deleteComment);

module.exports = commentsRouter;