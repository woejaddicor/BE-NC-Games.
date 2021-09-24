const express = require('express');
const { getCommentsByReviewer } = require('../controllers/comments.controller');

const commentsRouter = express.Router();

commentsRouter.get('/:review_id', getCommentsByReviewer);

module.exports = commentsRouter;