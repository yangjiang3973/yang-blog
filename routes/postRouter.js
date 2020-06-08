const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router(); // mount a new router

router
    .route('/')
    .get(postController.getAllPosts)
    .post(authController.protect, postController.createOnePost);

router
    .route('/:id')
    .get(postController.getOnePost)
    .patch(postController.updatePost)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        postController.deletePost
    );

module.exports = router;
