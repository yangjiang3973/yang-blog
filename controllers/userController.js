const UserDao = require('../dao/userDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { filterObj } = require('../utils/utils');

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await UserDao.getAllUsers();
    res.status(200).json({
        status: 'success',
        data: users
    });
});

module.exports.getOneUser = catchAsync(async (req, res, next) => {
    const user = await UserDao.getOneUser(req.params.id);
    res.status(200).json({
        status: 'success',
        data: user
    });
});

module.exports.updateUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const newData = req.body;
    const { value } = await UserDao.updateUser(id, newData);

    res.status(200).json({
        status: 'success',
        data: value
    });
});

module.exports.deleteUser = catchAsync(async (req, res, next) => {
    await UserDao.deleteUser(req.params.id);

    res.status(200).json({
        status: 'success',
        data: null
    });
});

module.exports.updateMe = catchAsync(async (req, res, next) => {
    // Check if logged in
    if (!req.user)
        return next(
            new AppError(
                400,
                'You are not authorized to do this action. Please login!'
            )
        );

    // Should not update password here
    if (req.body.password || req.body.newPassword)
        return next(
            new AppError(
                400,
                'You should not update password here. Please use /updateMyPassword'
            )
        );

    // Only update allowed fields! need to check first
    const filteredData = filterObj(req.body, 'name', 'email');

    // update
    const { value } = await UserDao.updateUser(req.user._id, filteredData);
    res.status(200).json({
        status: 'success',
        data: value
    });
});

module.exports.deleteMe = catchAsync(async (req, res, next) => {
    if (!req.user)
        return next(
            new AppError(
                400,
                'You are not authorized to do this action. Please login!'
            )
        );

    const { ok } = await UserDao.updateUser(req.user._id, {
        active: false
    });
    res.status(204).json({
        status: 'success',
        data: null
    });
});
