const express = require('express');
const categoriesRouter = require('./categories.router');
const commentsRouter = require('./comments.router');
const reviewsRouter = require('./reviews.router');
const usersRouter = require('./users.router');
const { describeJson } = require('../controllers/api.controller.js');

const apiRouter = express.Router();
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

apiRouter.get('/', describeJson);

module.exports = apiRouter;