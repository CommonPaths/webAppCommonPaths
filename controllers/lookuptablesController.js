// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const accessControlService = require('../services/accessControlService');

function showParanoidRecords(loggedUserRole) {
  if (loggedUserRole === 'admin') { return false; }
  return true;
}

function buildAttributes(reqBody) {
  const attributes = {
    conditions: reqBody.conditions,
    conditionsDesc: reqBody.conditionsDesc,
    mobAids: reqBody.mobAids,
    mobAidsDesc: reqBody.mobAidsDesc,
    prefSpaceType: reqBody.prefSpaceType,
    prefSpaceTypeDesc: reqBody.prefSpaceTypeDesc,
    clientCode: null,
    clientCodeDesc: null,
  };
  return attributes;
}

// GET index for lookuptables
exports.index_get = function lookuptablesController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    res.render('lookuptables');
  } else {
    res.status(403).end();
  }
};

// POST index for lookuptables
exports.index_post = function lookuptablesController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    res.render('lookuptables');
  } else {
    res.status(403).end();
  }
};

// Display list of all lookuptables.
exports.lookuptables_list = function lookuptablesController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    req.database.LookupCodes.findAll({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      order: [
        ['updatedAt', 'DESC'],
      ],
    }).then((lookuptableProfile) => {
     res.render('lookuptables', { lookupdata: lookuptableProfile, getLoggedUserRole: req.signedCookies.token.officer_role });
    });
  } else {
    res.status(403).end();
  }
};

// Display lookuptable update form on GET.
exports.lookuptable_update_get = function lookuptablesController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    if (req.query.id) {
      req.database.LookupCodes.findAll({ where: { id: req.query.id } })
        .then((lookuptableSearchResult) => {
          const searchResultCount = lookuptableSearchResult.length;
          res.render('lookuptableUpdate', {
            title: 'Update Record',
            search_result_count: searchResultCount,
            lookuptable_search_result: lookuptableSearchResult,
          });
        });
    } else { res.render('lookuptableUpdate', { title: 'Update Record' }); }
  } else {
    res.status(403).end();
  }
};

// Handle lookuptable update on POST.
exports.lookuptable_update_post = function lookuptablesController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    const attributes = buildAttributes(req.body);
    req.database.LookupCodes.update(
      attributes, { returning: true, where: { id: req.body.id } },
    ).then(([rowsUpdate, [updatedRecord]]) => {
      if (rowsUpdate === 1) {
        res.render('lookuptableUpdate', {
          s_status: 'Record updated',
          s_detail: updatedRecord,
        });
      } else {
        res.render('lookuptableUpdate', { s_status: 'Error updating record' });
      }
    });
  } else {
    res.status(403).end();
  }
};

// Display lookuptable delete form on GET.
exports.lookuptable_delete_get = function lookuptablesController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    if (req.params.id) {
      req.database.LookupCodes.findAll({
        paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
        where: { id: req.params.id },
      }).then((lookuptableSearchResult) => {
        res.render('lookuptableDelete', {
          title: 'Delete/Restore Record',
          lookuptableSearchResultCount: lookuptableSearchResult.length,
          lookuptableSearchResult,
        });
      });
    } else { res.render('lookuptableDelete', { title: 'Delete/Restore Record' }); }
  } else {
    res.status(403).end();
  }
};

// Handle lookuptable delete on POST.
exports.lookuptable_delete_post = function lookuptablesController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    let permanentDelete;
    let resultMessage;
    if (req.body.permanentDelete === 'true') {
      permanentDelete = true;
    } else { permanentDelete = false; }
    req.database.LookupCodes.findOne({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      where: { id: req.params.id },
    }).then((lookuptableSearchResult) => {
      // To check this is Paranoid/soft Delete
      if (lookuptableSearchResult.deletedAt === null) {
        req.database.LookupCodes.destroy({
          force: permanentDelete,
          where: { id: req.params.id },
        }).then((status) => {
          if ((status === 1) && (permanentDelete)) { resultMessage = 'Record Permanently Deleted !';
          } else if ((status === 1) && (!permanentDelete)) { resultMessage = 'Record Deleted !';
          } else { resultMessage = 'Error Processing Record'; }
          res.render('lookuptableDelete', { s_status: resultMessage });
        });
      } else {
        req.database.LookupCodes.restore({
          force: req.body.permanentDelete,
          where: { id: req.params.id },
        }).then((status) => {
          if (status === 1) { resultMessage = 'Record Restored'; }
          else { resultMessage = 'Error Processing Record'; }
          res.render('lookuptableDelete', { s_status: resultMessage });
        });
      }
    });
  } else {
    res.status(403).end();
  }
};

// Display lookuptables create form on GET.
exports.lookuptable_create_get = function lookuptablesController(req, res, next) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    req.database.LookupCodes.findAll({}).then((lookupCodes) => {
      res.render('lookuptableCreate', { title: 'add New value', lookupCodes });
      return lookupCodes;
    });
  } else {
    res.status(403).end();
  }
};

// Handle lookuptables create on POST.
exports.lookuptable_create_post = function lookuptablesController(req, res) {
  const permission = accessControlService.checkCreateAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    const attributes = buildAttributes(req.body);
    req.database.LookupCodes.create(
      attributes,
    ).then((checkRecord) => {
      if (checkRecord) {
        res.render('lookuptableCreate', { s_status: 'Record saved' });
      } else {
        res.render('lookuptableCreate', {
          s_status: 'Record already exists',
        });
      }
    });
  } else {
    res.status(403).end();
  }
};
