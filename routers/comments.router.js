const express = require('express');
const { updateComment, deleteComment, getAllComments } = require('../controllers/comments.controller');

const commentsRouter = express.Router();

commentsRouter.get('/', getAllComments);
commentsRouter.patch('/:comment_id', updateComment);
commentsRouter.delete('/:comment_id', deleteComment);

module.exports = commentsRouter;