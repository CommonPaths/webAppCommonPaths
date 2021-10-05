const express = require('express');

const router = express.Router();
const clientsController = require('../controllers/clientsController');

/// Clients ROUTES ///

// GET clients home page.
router.get('/', clientsController.index);

// GET request for creating a client. NOTE This must come before routes that display clients (id).
router.get('/create', clientsController.client_create_get);

// POST request for creating Client.
router.post('/create', clientsController.client_create_post);

// GET request to delete Client.
router.get('/:id/delete', clientsController.client_delete_get);

// POST request to delete Client.
router.post('/:id/delete', clientsController.client_delete_post);

// GET request to update Client.
router.get('/update', clientsController.client_update_get);

// POST request to update Client.
router.post('/update', clientsController.client_update_post);

// GET request for list of all Clients item.
router.get('/list', clientsController.clients_list);

// GET request for one Client.
router.get('/:id', clientsController.client_detail);

module.exports = router;
