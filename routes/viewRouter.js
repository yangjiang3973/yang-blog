const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');
const router = express.Router(); // mount a new router

router.route('/').get(viewController.home);
router.route('/posts/:id').get(viewController.post);

router.route('/admin').get(viewController.admin);
router.route('/admin').post(viewController.adminUploadPost);

module.exports = router;
