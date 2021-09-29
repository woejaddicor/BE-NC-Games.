const express = require('express');
const categoriesRouter = require('./categories.router');
const commentsRouter = require('./comments.router');
const reviewsRouter = require('./reviews.router');
const usersRouter = require('./users.router');

const apiRouter = express.Router();
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);


module.exports = apiRouter;