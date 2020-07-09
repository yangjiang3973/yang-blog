const AppError = require('./appError');

module.exports = err => {
    // No need to prettify err mesg in dev mode
    if (process.env.NODE_ENV === 'development') throw err;
    // already handled
    if (err.isOperational) throw err;
    // Handle operational errors in prod mode
    if (
        err.message ===
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
    ) {
        throw new AppError(400, 'The ID is invalid');
    }
    // validation error
    if (err.code === 121) {
        throw new AppError(400, 'The data is invalid');
    }
    // duplicate value
    if (err.code === 11000) {
        const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
        const message = `Duplicate field value: ${value}. Please use another value!`;
        throw new AppError(400, message);
    }
    throw err;
};
