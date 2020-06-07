const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserDao = require('../dao/userDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

module.exports.signup = catchAsync(async (req, res, next) => {
    const user = req.body;
    const { result } = await UserDao.createOneUser(user);
    if (result.ok !== 1 || result.n === 0) {
        return next(new AppError(404, 'Failed to create a new user'));
    }

    // jwt
    const token = signToken(user.id);

    res.status(201).json({
        status: 'success',
        token,
        data: user
    });
});

module.exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password exist
    if (!email || !password)
        return next(new AppError(400, 'Please provide email and password'));

    // check if user exist && password is correct
    const { user, correct } = await UserDao.checkUserPassword(email, password);
    if (!correct)
        return next(new AppError(401, 'In correct password or email'));

    // if ok, send token back to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});
