const PostDAO = require('../dao/postDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getAllPosts = catchAsync(async (req, res, next) => {
    const posts = await PostDAO.getAllPosts();

    res.status(200).json({
        status: 'success',
        results: posts.length,
        data: posts,
    });
});

module.exports.getOnePost = catchAsync(async (req, res, next) => {
    const post = await PostDAO.getOnePost(req.params.id);
    // TODO: need to add 404 error handling here

    res.status(200).json({
        status: 'success',
        data: post,
    });
});

module.exports.createOnePost = catchAsync(async (req, res, next) => {
    await PostDAO.createOnePost(req.body);
    res.status(201).json({
        status: 'success',
        data: null,
    });
});

module.exports.updatePost = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const newPost = req.body;
    await PostDAO.updatePost(id, newPost);

    res.status(200).json({
        status: 'success',
        data: null,
    });
});

module.exports.deletePost = catchAsync(async (req, res, next) => {
    await PostDAO.deletePost(req.params.id);

    res.status(200).json({
        status: 'success',
        data: null,
    });
});
