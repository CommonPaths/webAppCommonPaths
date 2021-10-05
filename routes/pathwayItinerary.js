const express = require('express');

const router = express.Router();
const pathwayItineraryController = require('../controllers/pathwayItineraryController');

/// Pathway Itinerary Formulation ///

// GET pathwayItinerary home page.
router.get('/', pathwayItineraryController.index);

// GET request to formulate an itinerary.
router.get('/formulate', pathwayItineraryController.pathwayItinerary_formulate_get);

// POST request to save the formulated itinerary.
router.post('/formulate', pathwayItineraryController.pathwayItinerary_formulate_post);

// GET request to load saved pathway itinerary.
router.get('/update', pathwayItineraryController.pathwayItinerary_update_get);

// POST request to edit/save loaded pathway itinerary.
router.post('/update', pathwayItineraryController.pathwayItinerary_update_post);

// GET request to load saved pathway itinerary.
router.get('/view', pathwayItineraryController.pathwayItinerary_view_get);

// GET request to list Pathways.
router.get('/list', pathwayItineraryController.pathways_list);

// POST request to list Pathways.
router.post('/list', pathwayItineraryController.pathways_list_post);

// GET request to load Delete Pathway itinerary.
router.get('/:id/delete', pathwayItineraryController.pathwayItinerary_delete_get);

// POST request to Delete Pathway itinerary.
router.post('/:id/delete', pathwayItineraryController.pathwayItinerary_delete_post);

// GET request to add Leg or step
router.get('/add', pathwayItineraryController.pathwayItinerary_add_get);

// POST request to add Leg or step
router.post('/add', pathwayItineraryController.pathwayItinerary_add_post);


module.exports = router;
