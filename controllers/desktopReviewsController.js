// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const accessControlService = require('../services/accessControlService');

function showParanoidRecords(loggedUserRole) {
  if (loggedUserRole === 'admin') { return false; }
  return true;
}

function buildAttributes(completeDate, reqBody) {
  const todaysDate = new Date(Date.now()).toISOString().substr(0, 10);
  const attributes = {
    reviewLocation: reqBody.reviewLocation,
    reviewStartDate: todaysDate,
    reviewCompleteDate: completeDate,
    priority: reqBody.priority,
    status: reqBody.status,
    officersId: reqBody.officersId,
    tripRequestsId: reqBody.tripRequestsId,
    notes: reqBody.notes.trim(),
  };
  return attributes;
}

exports.index = function desktopReviewControllers(req, res) {
  res.send('NOT IMPLEMENTED: Site Page');
};

// Display Desktop Review create form on GET.
exports.desktopReviews_create_get = function desktopReviewsController(req, res, next) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'desktopReviews');
  if (permission.granted) {
    req.database.TripRequestModel.findAll({
      where: { id: req.query.tripRequestsId },
      include: [{ model: req.database.ClientProfileModel }, { model: req.database.OfficerModel }],
    }).then((tripRequestData) => {
      const searchResultCount = tripRequestData.length;
      req.database.OfficerModel.findAll({ where: { active: true } }).then((officers) => {
        res.render('desktopReviewCreate', {
          title: 'Create Desktop Review',
          officers,
          tripRequestsId: req.query.tripRequestsId,
          search_result_count: searchResultCount,
          tripRequestData,
        });
      });
    });
  } else {
    res.status(403).end();
  }
};

// Handle Desktop Review create on POST.
exports.desktopReviews_create_post = function desktopReviewsController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'desktopReviews');
  if (permission.granted) {
    const attributes = buildAttributes(null, req.body);
    req.database.DesktopReviewModel.create(attributes)
      .then((checkRecord) => {
        if (checkRecord) {
          res.render('desktopReviewCreate', { s_status: 'Record saved' });
        } else {
          res.render('desktopReviewCreate', { s_status: 'Record not created Error' });
        }
      });
  } else {
    res.status(403).end();
  }
};

// Display Desktop Review delete form on GET.
exports.desktopReviews_delete_get = function desktopReviewsController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'desktopReviews');
  if (permission.granted) {
    if (req.params.id) {
      req.database.DesktopReviewModel.findAll({
        paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
        where: { id: req.params.id },
        include: [{ model: req.database.TripRequestModel,
          include: [{ model: req.database.ClientProfileModel }],
        }, { model: req.database.OfficerModel }],
      }).then((desktopReviewSearchResult) => {
        const desktopReviewResultCount = desktopReviewSearchResult.length;
        const desktopReviewData = JSON.parse(JSON.stringify(desktopReviewSearchResult));
        res.render('desktopReviewDelete', {
          title: 'Desktop Review Delete/Restore Record',
          desktopReviewResultCount,
          desktopReviewData,
        });
      });
    } else { res.render('desktopReviewDelete', { title: 'Desktop Review Delete/Restore Record' }); }
  } else {
    res.status(403).end();
  }
};

// Handle Desktop Review delete on POST.
exports.desktopReviews_delete_post = function desktopReviewsController(req, res) {
  const permission = accessControlService.checkDeleteAllAccess(req.signedCookies.token.officer_role, 'desktopReviews');
  if (permission.granted) {
    let permanentDelete;
    let resultMessage;
    if (req.body.permanentDelete === 'true') {
      permanentDelete = true;
    } else { permanentDelete = false; }
    req.database.DesktopReviewModel.findOne({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      where: { id: req.params.id },
    }).then((desktopReviewSearchResult) => {
      // To check this is Paranoid/soft Delete
      if (desktopReviewSearchResult.deletedAt === null) {
        req.database.DesktopReviewModel.destroy({
          force: permanentDelete,
          where: { id: req.params.id },
        })
          .then((status) => {
            if ((status === 1) && (permanentDelete)) { resultMessage = 'Record Permanently Deleted !';
            } else if ((status === 1) && (!permanentDelete)) { resultMessage = 'Record Deleted !';
            } else { resultMessage = 'Error Processing Record'; }
            res.render('desktopReviewDelete', { s_status: resultMessage });
          });
      } else {
        req.database.DesktopReviewModel.restore({
          force: req.body.permanentDelete,
          where: { id: req.params.id },
        })
          .then((status) => {
            if (status === 1) { resultMessage = 'Record Restored'; }
            else { resultMessage = 'Error Processing Record'; }
            res.render('desktopReviewDelete', { s_status: resultMessage });
          });
      }
    });
  } else {
    res.status(403).end();
  }
};

// Display Desktop Review update form on GET.
exports.desktopReviews_update_get = function desktopReviewsController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'desktopReviews');
  if (permission.granted) {
    if (req.query.desktopReviewId) {
      req.database.DesktopReviewModel.findAll({
        where: { id: req.query.desktopReviewId },
        include: [{ model: req.database.TripRequestModel,
          include: [{ model: req.database.ClientProfileModel }],
        }, { model: req.database.OfficerModel }],
      }).then((desktopReviewSearchResult) => {
        const desktopReviewResultCount = desktopReviewSearchResult.length;
        const desktopReviewData = JSON.parse(JSON.stringify(desktopReviewSearchResult));
        res.render('desktopReviewUpdate', {
          title: 'Desktop Review Details',
          desktopReviewResultCount,
          desktopReviewData,
        });
      });
    } else { res.render('desktopReviewUpdate', { title: 'Desktop Review Details' }); }
  } else {
    res.status(403).end();
  }
};

// Handle Desktop Review update on POST.
exports.desktopReviews_update_post = function desktopReviewsController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'desktopReviews');
  if (permission.granted) {
    let completeDate = req.body.reviewCompleteDate;
    if (req.body.reviewCompleteDate === '') { completeDate = null; } else { completeDate = req.body.reviewCompleteDate; }
    const attributes = buildAttributes(completeDate, req.body);
    req.database.DesktopReviewModel.update(attributes,
      { returning: true, where: { id: req.body.desktopReviewId } })
      .then(([rowsUpdate, [updatedRecord]]) => {
        if (rowsUpdate === 1) {
          req.database.DesktopReviewModel.findAll({
            where: { id: req.query.desktopReviewId },
            include: [{
              model: req.database.TripRequestModel,
              include:
              [{ model: req.database.ClientProfileModel }],
            },
            { model: req.database.OfficerModel }],
          }).then((desktopReviewSearchResult) => {
            const desktopReviewResultCount = desktopReviewSearchResult.length;
            const desktopReviewData = JSON.parse(JSON.stringify(desktopReviewSearchResult));
            res.render('desktopReviewUpdate', {
              title: 'Desktop Review Details',
              desktopReviewResultCount,
              desktopReviewData,
              s_status: 'Record updated',
              s_detail: updatedRecord,
            });
          });
        } else {
          res.render('desktopReviewUpdate', { s_status: 'Error updating record' });
        }
      });
  } else {
    res.status(403).end();
  }
};

// Display detail page for a specific client.
exports.desktopReviews_detail = function desktopReviewsController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'desktopReviews');
  if (permission.granted) {
    res.send(`NOT IMPLEMENTED: Client parameter passed after route (:id or /): ${req.params.id}`);
  } else {
    res.status(403).end();
  }
};
