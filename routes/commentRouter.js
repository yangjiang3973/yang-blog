const express = require('express');
const commentController = require('../controllers/commentController');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

// RESTful
router
    .route('/')
    .get(commentController.getAllComments)
    .post(commentController.createOneComment);

router
    .route('/:id')
    .get(commentController.getOneComment)
    .patch(commentController.updateComment)
    .delete(commentController.deleteComment);

module.exports = router;
