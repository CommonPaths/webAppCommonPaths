// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const accessControlService = require('../services/accessControlService');
const authService = require('../services/authService');

function showParanoidRecords(loggedUserRole) {
  if (loggedUserRole === 'admin') { return false; }
  return true;
}

function buildAttributes(reqBody) {
  const attributes = {
    idNumber: reqBody.idNumber,
    firstName: reqBody.firstName.trim(),
    lastName: reqBody.lastName.trim(),
    eMail: reqBody.eMail.trim(),
    cognitoSub: reqBody.cognitoSub,
    officerTitle: reqBody.officerTitle,
    officerRoles: reqBody.officerRoles,
    agency: reqBody.agency,
    zoneZips: reqBody.zoneZips,
    active: reqBody.active,
  };
  return attributes;
}

exports.index = function officersController(req, res) {
  res.send('NOT IMPLEMENTED: Site Page');
};

// Display officer create form on GET.
exports.officer_create_get = function officersController(req, res, next) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    req.database.LookupCodes.findAll({}).then((lookupCodes) => {
      res.render('officerCreate', { title: 'Create New Officer', lookupCodes });
      return lookupCodes;
    });
  }
};

// Handle officer create on POST.
exports.officer_create_post = function officersController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    const attributes = buildAttributes(req.body);
    req.database.OfficerModel.findOrCreate({
      where: { idNumber: req.body.idNumber },
      defaults: attributes,
    }).then((checkRecord) => {
      const returnedRecords = checkRecord[0].get({ plain: true });
      if (checkRecord[1]) {
        authService.registerUserWithTmpPassword(attributes.eMail,
          req.subdomains[process.env.SUBDOMAIN_ARRAY_INDEX], req);
        res.render('officerCreate', { s_status: 'Record saved' });
      } else {
        res.render('officerCreate', {
          s_status: 'Record already exists',
          s_detail: returnedRecords,
        });
      }
    });
  }
};

// Display officer delete form on GET.
exports.officer_delete_get = function officersController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    if (req.params.id) {
      req.database.OfficerModel.findAll({
        paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
        where: { id: req.params.id },
      }).then((officerSearchResult) => {
        res.render('officerDelete', {
          title: 'Delete/Restore Record',
          officerSearchResultCount: officerSearchResult.length,
          officerSearchResult,
        });
      });
    } else { res.render('officerDelete', { title: 'Delete/Restore Record' }); }
  }
};

// Handle officer delete on POST.
exports.officer_delete_post = function officersController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    let permanentDelete;
    let resultMessage;
    if (req.body.permanentDelete === 'true') {
      permanentDelete = true;
    } else { permanentDelete = false; }
    req.database.OfficerModel.findOne({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      where: { id: req.params.id },
    }).then((officerSearchResult) => {
      // To check this is Paranoid/soft Delete
      if (officerSearchResult.deletedAt === null) {
        authService.adminDeleteUser(officerSearchResult.eMail);
        req.database.OfficerModel.destroy({
          force: permanentDelete,
          where: { id: req.params.id },
        }).then((status) => {
          if ((status === 1) && (permanentDelete)) { resultMessage = 'Record Permanently Deleted !';
          } else if ((status === 1) && (!permanentDelete)) { resultMessage = 'Record Deleted !';
          } else { resultMessage = 'Error Processing Record'; }
          res.render('officerDelete', { s_status: resultMessage });
        });
      } else {
        req.database.OfficerModel.restore({
          force: req.body.permanentDelete,
          where: { id: req.params.id },
        }).then((status) => {
          if (status === 1) { resultMessage = 'Record Restored'; }
          else { resultMessage = 'Error Processing Record'; }
          res.render('officerDelete', { s_status: resultMessage });
        });
      }
    });
  }
};

// Display officer update form on GET.
exports.officer_update_get = function officersController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    if (req.query.id) {
      req.database.OfficerModel.findAll({ where: { id: req.query.id } })
        .then((officerSearchResult) => {
          req.database.LookupCodes.findAll({}).then((lookupCodes) => {
            const searchResultCount = officerSearchResult.length;
            res.render('officerUpdate', {
              title: 'Update Record',
              search_result_count: searchResultCount,
              officer_search_result: officerSearchResult,
              lookupCodes,
            });
          });
        });
    } else { res.render('officerUpdate', { title: 'Update Record' }); }
  }
};

// Handle officer update on POST.
exports.officer_update_post = function officersController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    const attributes = buildAttributes(req.body);
    req.database.OfficerModel.update(
      attributes, { returning: true, where: { id: req.body.id } },
    ).then(([rowsUpdate, [updatedRecord]]) => {
      if (rowsUpdate === 1) {
        res.render('officerUpdate', {
          s_status: 'Record updated',
          s_detail: updatedRecord,
        });
      } else {
        res.render('officerUpdate', { s_status: 'Error updating record' });
      }
    });
  }
};

// Display list of all officers.
exports.officers_list = function officersController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'settings');
  if (permission.granted) {
    req.database.OfficerModel.findAll({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      order: [
        ['updatedAt', 'DESC'],
      ],
    }).then((officerProfile) => {
      req.database.LookupCodes.findAll({}).then((lookupCodes) => {
        res.render('officers', { oData: officerProfile, lookupCodes, getLoggedUserRole: req.signedCookies.token.officer_role });
      });
    });
  }
};

// Display detail page for a specific officer.
exports.officer_detail = function officersController(req, res) {
  res.send(`NOT IMPLEMENTED: Officer parameter passed after route (:id or /): ${req.params.id}`);
};
