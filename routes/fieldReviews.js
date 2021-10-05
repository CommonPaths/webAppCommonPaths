const express = require('express');

const router = express.Router();
const fieldReviewsController = require('../controllers/fieldReviewsController');

/// Field Review ///

// GET Field Review home page.
router.get('/', fieldReviewsController.index);

// GET request for creating a Field Review.
// NOTE This must come before routes that display clients (id)
router.get('/create', fieldReviewsController.fieldReviews_create_get);

// POST request for creating Field Review.
router.post('/create', fieldReviewsController.fieldReviews_create_post);

// GET request to delete Field Review.
router.get('/:id/delete', fieldReviewsController.fieldReviews_delete_get);

// POST request to delete Field Review.
router.post('/:id/delete', fieldReviewsController.fieldReviews_delete_post);

// GET request to update Field Review.
router.get('/update', fieldReviewsController.fieldReviews_update_get);

// POST request to update Field Review.
router.post('/update', fieldReviewsController.fieldReviews_update_post);

// GET request for one Field Review.
router.get('/:id', fieldReviewsController.fieldReviews_detail);

module.exports = router;
