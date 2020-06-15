const path = require('path');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/errorHandler');
const postRouter = require('./routes/postRouter');
const userRouter = require('./routes/userRouter');
const commentRouter = require('./routes/commentRouter');
const viewRouter = require('./routes/viewRouter');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* middleware */
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1h
    message: 'Too many requests from this IP. Please try again later!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); // body parser

// data sanitization for NoSQL injection and XSS
app.use(mongoSanitize());
// app.use(xss());
// prevent parameter pollution(query string)
app.use(
    hpp({
        whitelist: ['title']
    })
);

/* routes */
app.use('/', viewRouter);
app.use('/api/v1/posts', postRouter); // sub-app
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', commentRouter);

// all unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(404, `Cannot find ${req.originalUrl}`));
});

// 4 params, error handling middleware. When call next(err), it will jump to this central error handler
app.use(globalErrorHandler);

module.exports = app;
