const CommentDao = require('../dao/commentDAO');

module.exports.createOneComment = async (req, res, next) => {
    try {
        const comment = req.body;
        await CommentDao.createOneComment(comment);
        res.status(201).json({
            status: 'success',
            data: comment
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports.getAllComments = async (req, res, next) => {
    try {
        const comments = await CommentDao.getAllComments();
        res.status(200).json({
            status: 'success',
            data: comments
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports.getOneComment = async (req, res, next) => {
    try {
        const comment = await CommentDao.getOneComment(req.params.id);
        res.status(200).json({
            status: 'success',
            data: comment
        });
    } catch (err) {
        console.log('module.exports.getOneComment -> err', err);
    }
};

module.exports.updateComment = async (req, res, next) => {
    try {
        const id = req.params.id;
        const newData = req.body;
        await CommentDao.updateComment(id, newData);
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.log('module.exports.updateComment -> err', err);
    }
};

module.exports.deleteComment = async (req, res, next) => {
    try {
        await CommentDao.deleteComment(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.log('module.exports.deleteComment -> err', err);
    }
};
