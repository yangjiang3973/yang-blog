const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');
const router = express.Router(); // mount a new router

router.route('/').get(viewController.home);
router.route('/posts/:id').get(authController.isLoggedIn, viewController.post);

router.route('/account').get(authController.protect, viewController.account);

router.route('/docs').get(viewController.docs);

router.route('/tags').get(viewController.tags);

router.route('/admin').get(viewController.admin);
router.route('/admin').post(viewController.adminUploadPost);

module.exports = router;
