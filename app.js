const express = require('express');

const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const commentRouter = require('./routes/commentRouter');

const app = express();

/* middleware */
app.use(express.json({ limit: '10kb' }));

app.use('/api/v1/posts', postRouter); // sub-app
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', commentRouter);

module.exports = app;
