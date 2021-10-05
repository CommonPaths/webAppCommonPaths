const express = require('express');

const router = express.Router();
const loginController = require('../controllers/loginController');

/* GET home page. */
router.get('home', (req, res, next) => {
  res.render('home', { title: 'Dashboard' });
});

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Welcome to RWMA' });
});

router.post('/', loginController.auth_post);

module.exports = router;
