const PostDAO = require('../dao/postDAO');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports.getAllPosts = catchAsync(async (req, res, next) => {
    const posts = await PostDAO.getAllPosts();

    res.status(200).json({
        status: 'success',
        results: posts.length,
        data: posts
    });
});

module.exports.getOnePost = catchAsync(async (req, res, next) => {
    const post = await PostDAO.getOnePost(req.params.id);

    if (!post) {
        return next(new AppError(404, 'No post found with that ID'));
    }

    res.status(200).json({
        status: 'success',
        data: post
    });
});

module.exports.createOnePost = catchAsync(async (req, res, next) => {
    req.body.createdAt = new Date(Date.now());
    const { result } = await PostDAO.createOnePost(req.body);

    if (result.ok !== 1 || result.n === 0) {
        return next(new AppError(404, 'Failed to create a new post'));
    }

    res.status(201).json({
        status: 'success',
        data: null
    });
});

module.exports.updatePost = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const newPost = req.body;
    const { result } = await PostDAO.updatePost(id, newPost);

    if (result.ok !== 1 || result.n === 0) {
        return next(new AppError(404, 'Failed to update this post'));
    }

    res.status(200).json({
        status: 'success',
        data: null
    });
});

module.exports.deletePost = catchAsync(async (req, res, next) => {
    const { result } = await PostDAO.deletePost(req.params.id);
    if (result.ok !== 1 || result.n === 0) {
        return next(new AppError(404, 'Failed to delete this post'));
    }
    res.status(200).json({
        status: 'success',
        data: null
    });
});
