const express = require('express');

const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

/// Reviews Dashboard ///

// GET Review home page.
router.get('/', reviewsController.index);

// POST Review home page.
router.post('/', reviewsController.index_post);

module.exports = router;
