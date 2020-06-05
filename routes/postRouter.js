const express = require('express');
const postController = require('../controllers/postController');

const router = express.Router(); // mount a new router

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
