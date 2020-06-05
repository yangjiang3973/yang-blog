const UserDao = require('../dao/userDAO');

module.exports.createOneUser = async (req, res, next) => {
    try {
        const user = req.body;
        await UserDao.createOneUser(user);
        res.status(201).json({
            status: 'success',
            data: user
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserDao.getAllUsers();
        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports.getOneUser = async (req, res, next) => {
    try {
        const user = await UserDao.getOneUser(req.params.id);
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (err) {
        console.log('module.exports.getOneUser -> err', err);
    }
};

module.exports.updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        await UserDao.updateUser(id, newData);
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.log('module.exports.updateUser -> err', err);
    }
};

module.exports.deleteUser = async (req, res, next) => {
    try {
        await UserDao.deleteUser(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.log('module.exports.deleteUser -> err', err);
    }
};
