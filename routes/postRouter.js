const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router(); // mount a new router

router.use(authController.protect, authController.restrictTo('admin'));

router
    .route('/')
    .get(postController.getAllPosts)
    .post(postController.createOnePost);

router
    .route('/:id')
    .get(postController.getOnePost)
    .patch(postController.updatePost)
    .delete(postController.deletePost);

module.exports = router;
