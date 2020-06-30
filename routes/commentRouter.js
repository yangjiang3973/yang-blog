const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');
const router = express.Router();

// RESTful
router
    .route('/')
    .get(commentController.getAllComments)
    .post(authController.protect, commentController.createOneComment);

router
    .route('/:id')
    .get(commentController.getOneComment)
    .patch(commentController.updateComment)
    .delete(commentController.deleteComment);

module.exports = router;
