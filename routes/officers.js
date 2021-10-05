const express = require('express');

const router = express.Router();
const officersController = require('../controllers/officersController');

/// Officers ROUTES ///

// GET officers home page.
router.get('/', officersController.index);

// GET request for creating an officer. NOTE This must come before routes that display officers (id)
router.get('/create', officersController.officer_create_get);

// POST request for creating Officer.
router.post('/create', officersController.officer_create_post);

// GET request to delete Officer.
router.get('/:id/delete', officersController.officer_delete_get);

// POST request to delete Officer.
router.post('/:id/delete', officersController.officer_delete_post);

// GET request to update Officer.
router.get('/update', officersController.officer_update_get);

// POST request to update Officer.
router.post('/update', officersController.officer_update_post);

// GET request for list of all officers item.
router.get('/list', officersController.officers_list);

// GET request for one Officer.
router.get('/:id', officersController.officer_detail);

module.exports = router;
