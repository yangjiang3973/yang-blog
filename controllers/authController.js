const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserDao = require('../dao/userDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { isPasswordChangedAfterJWT } = require('../utils/validators');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

module.exports.signup = catchAsync(async (req, res, next) => {
    const user = req.body;
    const { result, insertedId } = await UserDao.createOneUser(user);
    if (result.ok !== 1 || result.n === 0) {
        return next(new AppError(404, 'Failed to create a new user'));
    }
    // jwt
    const token = signToken(insertedId);

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

module.exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // 1) get token and check exsistence
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError(401, 'Please login to get access!'));
    }
    // 2) varify the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // {id, iat, exp}

    // 3) check if user still exist/active
    const user = await UserDao.getOneUser(decoded.id);
    if (!user || user.active === false) {
        return next(
            new AppError(
                401,
                'The user belonging to this token does no longer exist'
            )
        );
    }
    // 4) check if user changed the password after token was issued
    if (isPasswordChangedAfterJWT(user.passwordChangedAt, decoded.iat)) {
        return next(
            new AppError(401, 'The password was changed. Please login again!')
        );
    }

    req.user = user;
    next();
});

module.exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(
                new AppError(
                    403,
                    'You do not have permission to perform this action'
                )
            );
        next();
    };
};
