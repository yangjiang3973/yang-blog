const CommentDao = require('../dao/commentDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.createOneComment = catchAsync(async (req, res, next) => {
    const { text, postId } = req.body;
    const username = req.user.name;
    const newComment = { username, text, postId };
    await CommentDao.createOneComment(newComment);

    res.status(201).json({
        status: 'success',
        data: newComment
    });
});

module.exports.getAllComments = catchAsync(async (req, res, next) => {
    const comments = await CommentDao.getAllComments();
    res.status(200).json({
        status: 'success',
        data: comments
    });
});

module.exports.getOneComment = catchAsync(async (req, res, next) => {
    const comment = await CommentDao.getOneComment(req.params.id);
    if (!comment) {
        return next(new AppError(404, 'No comment found with that ID'));
    }
    res.status(200).json({
        status: 'success',
        data: comment
    });
});

module.exports.updateComment = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const newData = req.body;
    await CommentDao.updateComment(id, newData);
    res.status(200).json({
        status: 'success',
        data: null
    });
});

module.exports.deleteComment = catchAsync(async (req, res, next) => {
    await CommentDao.deleteComment(req.params.id);
    res.status(200).json({
        status: 'success',
        data: null
    });
});
