const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/login/github/callback/').get(authController.loginByGithub);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
    .route('/updateMyPassword')
    .patch(authController.protect, authController.updatePassword);
router
    .route('/updateMe')
    .patch(authController.protect, userController.updateMe);
router
    .route('/deleteMe')
    .delete(authController.protect, userController.deleteMe);

// RESTful APIs
router.route('/').get(userController.getAllUsers);
// .post(userController.createOneUser);

router
    .route('/:id')
    .get(userController.getOneUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
