const express = require('express');

const router = express.Router();
const loginController = require('../controllers/loginController');

/// Login ROUTES ///

// GET login page.
router.get('/', loginController.auth_get);

// Post login page.
router.post('/', loginController.auth_post);

// GET request for forgotpassword
router.get('/forgotPassword', loginController.forgot_get);

// POST request for forgotpassword
router.post('/forgotpassword', loginController.forgot_pw_post);

router.get('/index', loginController.auth_get);

module.exports = router;
