const express = require('express');
const categoriesRouter = require('./categories.router');
const commentsRouter = require('./comments.router');
const reviewsRouter = require('./reviews.router');


// const {handleError, send404} = require('../controllers/error.controller')

const apiRouter = express.Router();
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
// apiRouter.use((req, res, next) =>{
  
//     next()
// })

module.exports = apiRouter;