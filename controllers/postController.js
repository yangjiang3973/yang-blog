const PostDAO = require('../dao/postDAO');

module.exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await PostDAO.getAllPosts();
        res.status(200).json({
            status: 'success',
            results: posts.length,
            data: posts
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports.getOnePost = async (req, res, next) => {
    try {
        const post = await PostDAO.getOnePost(req.params.id);
        res.status(200).json({
            status: 'success',
            data: post
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports.createOnePost = async (req, res, next) => {
    try {
        const r = await PostDAO.createOnePost(req.body);
        res.status(201).json({
            status: 'success',
            data: req.body
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports.updatePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const newPost = req.body;
        await PostDAO.updatePost(id, newPost);
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.log(err);
    }
};

module.exports.deletePost = async (req, res, next) => {
    try {
        await PostDAO.deletePost(req.params.id);
        res.status(200).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        console.log(err);
    }
};
