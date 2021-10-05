const express = require('express');

const router = express.Router();
const homeController = require('../controllers/homeController');

/// Home ROUTES ///

// GET Dashboard home page.
router.get('/', homeController.dashboardList);

module.exports = router;
