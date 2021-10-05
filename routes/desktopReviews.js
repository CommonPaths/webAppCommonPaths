const express = require('express');

const router = express.Router();
const desktopReviewsController = require('../controllers/desktopReviewsController');

/// Desktop Review ///

// GET Desktop Review home page.
router.get('/', desktopReviewsController.index);

// GET request for creating a Desktop Review.
// NOTE This must come before routes that display clients (id)
router.get('/create', desktopReviewsController.desktopReviews_create_get);

// POST request for creating Desktop Review.
router.post('/create', desktopReviewsController.desktopReviews_create_post);

// GET request to delete Desktop Review.
router.get('/:id/delete', desktopReviewsController.desktopReviews_delete_get);

// POST request to delete Desktop Review.
router.post('/:id/delete', desktopReviewsController.desktopReviews_delete_post);

// GET request to update Desktop Review.
router.get('/update', desktopReviewsController.desktopReviews_update_get);

// POST request to update Desktop Review.
router.post('/update', desktopReviewsController.desktopReviews_update_post);

// GET request for one Desktop Review.
router.get('/:id', desktopReviewsController.desktopReviews_detail);

module.exports = router;
