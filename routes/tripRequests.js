const express = require('express');

const router = express.Router();
const tripRequestsController = require('../controllers/tripRequestsController');

/// tripRequests ROUTES ///

// GET tripRequests home page.
router.get('/', tripRequestsController.index);

// GET request for creating a Trip Request. NOTE This must come before routes that display by (id).
router.get('/create', tripRequestsController.tripRequest_create_get);

// POST request for creating Trip Request.
router.post('/create', tripRequestsController.tripRequest_create_post);

// POST request for cloning Trip Request.
router.post('/clone', tripRequestsController.tripRequest_clone_post);

// POST request for Geocoding Trip Request.
router.post('/geocode', tripRequestsController.tripRequest_update_geocode);

// GET request to delete Trip Request.
router.get('/:id/delete', tripRequestsController.tripRequest_delete_get);

// POST request to delete Trip Request.
router.post('/:id/delete', tripRequestsController.tripRequest_delete_post);

// GET request to update Trip Request.
router.get('/update', tripRequestsController.tripRequest_update_get);

// POST request to update Trip Request.
router.post('/update', tripRequestsController.tripRequest_update_post);

// GET request for list based on default filter values Trip Request item.
router.get('/list', tripRequestsController.tripRequests_list);

// POST request for list based on filter Trip Request item.
router.post('/list', tripRequestsController.tripRequests_list_post);

// GET request for one Trip Request
router.get('/:id', tripRequestsController.tripRequest_detail);

module.exports = router;
