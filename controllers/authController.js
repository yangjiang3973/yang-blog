const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const validator = require('validator');
const UserDao = require('../dao/userDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { isPasswordChangedAfterJWT } = require('../utils/validators');
const { sendEmail } = require('../utils/utils');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const cookieOptions = {
    expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: false // TODO: will change it when deployment
};

const createTokenResponse = (id, code, req, res, type) => {
    const token = signToken(id);
    if (process.env.NODE_ENV === 'development') cookieOptions.secure = false;

    res.cookie('jwt', token, cookieOptions);

    if (type === 'html') {
        // this is for github login
        res.status(code).redirect(req.get('Referrer'));
    } else {
        res.status(code).json({
            status: 'success',
            token //TODO: is it possible to remove it? by only using cookie in view. also need to change `protect`
        });
    }
};

module.exports.signup = catchAsync(async (req, res, next) => {
    const user = req.body;
    console.log('module.exports.signup -> user', user);
    const { result, insertedId } = await UserDao.createOneUser(user);
    if (result.ok !== 1 || result.n === 0) {
        return next(new AppError(404, 'Failed to create a new user'));
    }
    // jwt
    createTokenResponse(insertedId, 201, req, res);
});

module.exports.loginByGithub = catchAsync(async (req, res, next) => {
    const code = req.query.code;
    let res_token = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code
        }
    );

    // res_token=aa73b037629ff95e8273728b7999a376d2a1c097&scope=&token_type=bearer
    let token = res_token.data.split('=')[1].replace('&scope', ''); // TODO: use a better way to parse

    // use token to get users info
    let userRes = await axios.get(
        `https://api.github.com/user?access_token=${token}`
    );
    let userInfo = userRes.data; // { login:username, name: john L, email:abc@123.com }

    /* TODO: wrap the about code as a function! */

    // check if username logged in before from github
    const userFromGithub = await UserDao.findUserByField({
        githubUserName: userInfo.login
    });
    if (userFromGithub) {
        createTokenResponse(userFromGithub._id, 200, req, res, 'html');
    } else {
        // new user, create a new doc
        const userWithSameName = await UserDao.findUserByName(userInfo.login);
        const newUser = { githubUserName: userInfo.login };
        if (!userWithSameName) {
            newUser.name = userInfo.login;
        } else {
            // create a random string to avoide duplicate name
            let randomName = crypto.randomBytes(5).toString('hex');
            while (await UserDao.findUserByName(randomName)) {
                randomName = crypto.randomBytes(10).toString('hex');
            }
            newUser.name = randomName;
        }
        const { result, insertedId } = await UserDao.createOneUser(newUser);
        if (result.ok !== 1 || result.n === 0) {
            return next(new AppError(404, 'Failed to create a new user'));
        }
        createTokenResponse(insertedId, 201, req, res, 'html');
    }
});

module.exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password exist
    if (!email || !password || !validator.isEmail(email))
        return next(
            new AppError(400, 'Please provide valid email and password')
        );

    // check if user exist && password is correct
    const { user, correct } = await UserDao.checkUserPassword(email, password);
    if (!correct)
        return next(new AppError(401, 'In correct password or email'));
    // active user again after deleting himself
    if (!user.active) {
        const { ok } = await UserDao.updateUser(user._id, {
            active: true
        });
        if (ok !== 1) {
            return next(
                new AppError(
                    404,
                    'Failed to active your account. Please try again!'
                )
            );
        }
    }
    createTokenResponse(user._id, 200, req, res);
});

module.exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        status: 'success'
    });
};

module.exports.isLoggedIn = async (req, res, next) => {
    res.locals.user = null;
    if (!req.cookies || !req.cookies.jwt) return next();

    try {
        // verify jwt
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
        );
        // check if user exists/active
        const currentUser = await UserDao.getOneUser(decoded.id);
        if (!currentUser || currentUser.active === false) return next();
        // check if user changed password after token issued
        if (
            isPasswordChangedAfterJWT(
                currentUser.passwordChangedAt,
                decoded.iat
            )
        )
            return next();

        // finally this is a logged in user
        res.locals.user = currentUser;
        next();
    } catch (err) {
        return next();
    }
};

module.exports.protect = catchAsync(async (req, res, next) => {
    let token;
    // 1) get token and check exsistence
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
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

module.exports.forgotPassword = catchAsync(async (req, res, next) => {
    // get user based on POSTed email
    const user = await UserDao.findUserByEmail(req.body.email);
    if (!user)
        return next(new AppError(404, 'There is no user with this email'));

    // generate a random token
    const resetToken = await UserDao.createPasswordResetToken(user._id);

    // send it by email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit new password and password confirm to: ${resetURL}`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Reset your password(valid in 10min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to your email'
        });
    } catch (err) {
        // reset token and expires time
        await UserDao.deletePasswordResetToken(user);
        return next(
            new AppError(
                500,
                'There is an error sending the email! Please try again later'
            )
        );
    }
});

module.exports.resetPassword = catchAsync(async (req, res, next) => {
    // get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await UserDao.findUserByToken(hashedToken);

    // check if there is a user and token is not expired, set new password
    if (!user) {
        return next(new AppError(400, 'Token is invalid or expired!'));
    }
    await UserDao.resetPassword(
        user._id,
        req.body.password,
        req.body.passwordConfirm
    );

    createTokenResponse(user._id, 200, req, res);
});

module.exports.updatePassword = catchAsync(async (req, res, next) => {
    // get the user from the collection
    if (!req.user)
        return next(
            new AppError(
                401,
                'You are not authorized to do this action. Please login!'
            )
        );

    // if this is not the first time to set password
    if (!req.user.passwordMissing) {
        // if the POSTed password is correct
        const { correct } = await UserDao.checkUserPassword(
            req.user.email,
            req.body.currentPassword
        );
        if (!correct)
            return next(new AppError(400, 'You input a wrong password!'));
    }

    // update the password
    await UserDao.resetPassword(
        req.user._id,
        req.body.newPassword,
        req.body.newPasswordConfirm
    );

    createTokenResponse(req.user._id, 200, req, res);
});
