const express = require('express');

const router = express.Router();
const lookuptablesController = require('../controllers/lookuptablesController');

/// Settings Page ///

// GET settings home page.
router.get('/', lookuptablesController.index_get);

// GET request for creating new value. NOTE This must come before routes that display officers (id)
router.get('/create', lookuptablesController.lookuptable_create_get);

// POST request for creating new value
router.post('/create', lookuptablesController.lookuptable_create_post);

// POST settings home page.
router.post('/', lookuptablesController.index_post);

// GET request for list of all o.
router.get('/list', lookuptablesController.lookuptables_list);

// GET request to update lookuptable.
router.get('/update', lookuptablesController.lookuptable_update_get);

// POST request to update lookuptable.
router.post('/update', lookuptablesController.lookuptable_update_post);

// GET request to delete lookuptable.
router.get('/:id/delete', lookuptablesController.lookuptable_delete_get);

// POST request to delete lookuptable.
router.post('/:id/delete', lookuptablesController.lookuptable_delete_post);

module.exports = router;
