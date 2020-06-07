const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

// RESTful APIs
router.route('/').get(userController.getAllUsers);
// .post(userController.createOneUser);

router
    .route('/:id')
    .get(userController.getOneUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
