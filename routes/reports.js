const express = require('express');

const router = express.Router();
const reportsController = require('../controllers/reportsController');

/// Reports ROUTES ///

// GET request for reports.
router.get('/statReports', reportsController.reports_get);

//POST request for reports.
router.post('/statReports', reportsController.reports_post);

module.exports = router;