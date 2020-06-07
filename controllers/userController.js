const UserDao = require('../dao/userDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/* move to authController as sign up */
// module.exports.createOneUser = catchAsync(async (req, res, next) => {
//     const user = req.body;
//     const { result } = await UserDao.createOneUser(user);
//     if (result.ok !== 1 || result.n === 0) {
//         return next(new AppError(404, 'Failed to create a new user'));
//     }
//     res.status(201).json({
//         status: 'success',
//         data: user
//     });
// });

module.exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await UserDao.getAllUsers();
    res.status(200).json({
        status: 'success',
        data: users
    });
});

module.exports.getOneUser = catchAsync(async (req, res, next) => {
    const user = await UserDao.getOneUser(req.params.id);
    if (!user) {
        return next(new AppError(404, 'No user found with that ID'));
    }
    res.status(200).json({
        status: 'success',
        data: user
    });
});

module.exports.updateUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const newData = req.body;
    const { result } = await UserDao.updateUser(id, newData);
    if (result.ok !== 1 || result.n === 0) {
        return next(new AppError(404, 'Failed to update this user'));
    }
    res.status(200).json({
        status: 'success',
        data: null
    });
});

module.exports.deleteUser = catchAsync(async (req, res, next) => {
    const { result } = await UserDao.deleteUser(req.params.id);
    if (result.ok !== 1 || result.n === 0) {
        return next(new AppError(404, 'Failed to delete this user'));
    }
    res.status(200).json({
        status: 'success',
        data: null
    });
});
