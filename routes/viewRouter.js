const express = require('express');
const authController = require('../controllers/authController');
const viewController = require('../controllers/viewController');
const router = express.Router(); // mount a new router

router.route('/').get(viewController.home);

module.exports = router;
