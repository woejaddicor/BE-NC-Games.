const express = require('express');
const apiRouter = require('./routers/api.router')

const app = express();
app.use(express.json());

app.use('/api', apiRouter)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else next (err);
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
      res.status(400).send({msg: "Bad Request"});
   } else next(err)
});

// app.use((err, req, res, next) => {
//     if (err.code === '22P02') {
//       res.status(400).send({ msg: 'Invalid input' });
//     } else next(err);
//   });

module.exports = app;