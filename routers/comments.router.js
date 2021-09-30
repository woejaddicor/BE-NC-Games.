const express = require('express');
const { getCommentsByReviewer, updateComment } = require('../controllers/comments.controller');

const commentsRouter = express.Router();

commentsRouter.get('/:review_id', getCommentsByReviewer);
commentsRouter.patch('/:comment_id', updateComment);

module.exports = commentsRouter;