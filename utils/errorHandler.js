/* Global Error Handler*/
const AppError = require('../utils/appError');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'production') {
        /* maybe need to pre-handle unmarked error(generated automatically) to AppError here */
        if (err.name === 'JsonWebTokenError')
            err = new AppError(401, 'Invalid token. Please login again!');
        if (err.name === 'TokenExpiredError')
            err = new AppError(401, 'Expired token. Please login again!');
        // Operational errors are created by AppError class
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            console.error('Error:', err);
            // Programming error(not operational error), just send generic message to clients
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong, please try again later'
            });
        }
    } else {
        // show detailed error info in development mod
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
};
