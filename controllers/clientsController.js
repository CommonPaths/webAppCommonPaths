// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
const accessControlService = require('../services/accessControlService');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

function showParanoidRecords(loggedUserRole) {
  if (loggedUserRole === 'admin') { return false; }
  return true;
}

function buildAttributes(clientsId, reqBody) {
  const attributes = {
    clientName: reqBody.clientName.trim(),
    clientId: reqBody.clientId,
    conditions: String(reqBody.conditions).split(','),
    mobAids: String(reqBody.mobAids).split(','),
    prefSpaceType: String(reqBody.prefSpaceType).split(','),
    btt: reqBody.btt.trim(),
    clientStatus: reqBody.clientStatus,
    notes: reqBody.notes.trim(),
  };
  return attributes;
}

exports.index = function clientController(req, res) {
  res.send('NOT IMPLEMENTED: Site Page');
};

// Display client create form on GET.
exports.client_create_get = function clientController(req, res, next) {
  const permission = accessControlService.checkCreateAllAccess(req.signedCookies.token.officer_role, 'clients');
  if (permission.granted) {
    // TODO: lookup table for all constants such as, mobility aid, space type , elig. cond. ,etc.
    req.database.LookupCodes.findAll({}).then((lookupCodes) => {
      res.render('client_create', { title: 'Create New Client', lookupCodes });
      return lookupCodes;
    });
  } else {
    res.status(403).end();
  }
};

// Handle client create on POST.
exports.client_create_post = function clientController(req, res) {
  const permission = accessControlService.checkCreateAllAccess(req.signedCookies.token.officer_role, 'clients');
  if (permission.granted) {
    const attributes = buildAttributes(req.body.clientsId, req.body);
    req.database.ClientProfileModel.findOrCreate({
      where: { clientId: req.body.clientId },
      defaults: attributes,
    })
      .then((checkRecord) => {
        const returnedRecords = checkRecord[0].get({ plain: true });
        if (checkRecord[1]) {
          res.render('client_create', { s_status: 'Record saved' });
        } else {
          res.render('client_create', {
            s_status: 'Record already exists',
            s_detail: returnedRecords,
          });
        }
      });
  } else {
    res.status(403).end();
  }
};

// Display client delete form on GET.
exports.client_delete_get = function clientController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'clients');
  if (permission.granted) {
    if (req.params.id) {
      req.database.ClientProfileModel.findAll({
        paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
        where: { id: req.params.id },
      }).then((clientSearchResult) => {
        // Find all related records
        req.database.TripRequestModel.findAll({
          paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
          where: { clientsId: req.params.id },
        })
          .then((tripRequestSearchResult) => {
            res.render('clientDelete', {
              title: 'Delete/Restore Record',
              clientSearchResultCount: clientSearchResult.length,
              clientSearchResult,
              tripRequestSearchResultCount: tripRequestSearchResult.length,
              tripRequestSearchResult,
            });
          });
      });
    } else { res.render('clientDelete', { title: 'Delete/Restore Record' }); }
  } else {
    res.status(403).end();
  }
};

// Handle client delete on POST.
exports.client_delete_post = function clientController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'clients');
  if (permission.granted) {
    let permanentDelete;
    let resultMessage;
    if (req.body.permanentDelete === 'true') {
      permanentDelete = true;
    } else { permanentDelete = false; }
    req.database.ClientProfileModel.findOne({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      where: { id: req.params.id },
    }).then((clientSearchResult) => {
      // To check this is Paranoid/soft Delete
      if (clientSearchResult.deletedAt === null) {
        req.database.ClientProfileModel.destroy({
          force: permanentDelete,
          where: { id: req.params.id },
        })
          .then((status) => {
            if ((status === 1) && (permanentDelete)) {
              resultMessage = 'Record Permanently Deleted !';
            } else if ((status === 1) && (!permanentDelete)) {
              resultMessage = 'Record Deleted !';
            } else { resultMessage = 'Error Processing Record'; }
            res.render('clientDelete', { s_status: resultMessage });
          });
      } else {
        req.database.ClientProfileModel.restore({
          force: req.body.permanentDelete,
          where: { id: req.params.id },
        })
          .then((status) => {
            if (status === 1) {
              resultMessage = 'Record Restored';
            } else { resultMessage = 'Error Processing Record'; }
            res.render('clientDelete', { s_status: resultMessage });
          });
      }
    });
  } else {
    res.status(403).end();
  }
};

// Display client update form on GET.
exports.client_update_get = function clientController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'clients');
  if (permission.granted) {
    if (req.query.clientId) {
      req.database.ClientProfileModel.findAll({ where: { clientId: req.query.clientId } })
        .then((clientSearchResult) => {
          req.database.LookupCodes.findAll({}).then((lookupCodes) => {
            const searchResultCount = clientSearchResult.length;
            res.render('client_update', {
              title: 'Update Record',
              search_result_count: searchResultCount,
              client_search_result: clientSearchResult,
              lookupCodes,
            });
          });
        });
    } else { res.render('client_update', { title: 'Update Record' }); }
  } else {
    res.status(403).end();
  }
};

// Handle client update on POST.
exports.client_update_post = function clientController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'clients');
  if (permission.granted) {
    const attributes = buildAttributes(req.body.clientsId, req.body);
    req.database.ClientProfileModel.update(attributes,
      { returning: true, where: { clientId: req.body.clientId } })
      .then(([rowsUpdate, [updatedRecord]]) => {
        if (rowsUpdate === 1) {
          res.render('client_update', {
            s_status: 'Record updated',
            s_detail: updatedRecord,
          });
        } else {
          res.render('client_update', { s_status: 'Error updating record' });
        }
      });
  } else {
    res.status(403).end();
  }
};

// Display list of all clients.
exports.clients_list = function clientController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'clients');
  if (permission.granted) {
    req.database.ClientProfileModel.findAll({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      order: [
        ['updatedAt', 'DESC'],
      ],
    })
      .then((clientProfile) => {
        req.database.LookupCodes.findAll({}).then((lookupCodes) => {
          res.render('clients', { client_view: clientProfile, lookupCodes, getLoggedUserRole: req.signedCookies.token.officer_role });
        });
      });
  } else {
    res.status(403).end();
  }
};

// Display detail page for a specific client.
exports.client_detail = function clientController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'clients');
  if (permission.granted) {
    res.send(`NOT IMPLEMENTED: Client parameter passed after route (:id or /): ${req.params.id}`);
  } else {
    res.status(403).end();
  }
};
