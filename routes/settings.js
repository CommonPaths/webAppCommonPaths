const express = require('express');

const router = express.Router();
const settingsController = require('../controllers/settingsController');

/// Settings Page ///

// GET settings home/Landing page.
router.get('/', settingsController.index_get);

// GET general page.
router.get('/general', settingsController.general_get);

// POST general page.
router.post('/general', settingsController.general_post);

module.exports = router;
