const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

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
