// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

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
    mapNoteId: reqBody.mapNoteId,
    URLMapNote: reqBody.URLMapNote,
    fieldPicturesMeta: reqBody.fieldPicturesMeta,
    priority: reqBody.priority,
    status: reqBody.status,
    officersId: reqBody.officersId,
    tripRequestsId: reqBody.tripRequestsId,
    notes: reqBody.notes.trim(),
  };
  return attributes;
}

exports.index = function fieldReviewControllers(req, res) {
  res.send('NOT IMPLEMENTED: Site Page');
};

// Display Field Review create form on GET.
exports.fieldReviews_create_get = function fieldReviewsController(req, res, next) {
  req.database.TripRequestModel.findAll({
    where: { id: req.query.tripRequestsId },
    include: [{ model: req.database.ClientProfileModel }, { model: req.database.OfficerModel }],
  }).then((tripRequestData) => {
    const tripSearchResultCount = tripRequestData.length;
    req.database.OfficerModel.findAll({ where: { active: true } }).then((officers) => {
      req.database.ADAPathwayModel.findAll({
        where: { tripRequestsId: req.query.tripRequestsId },
      }).then((ADAPathwaySearchResult) => {
        req.database.SettingModel.findByPk(1).then((settingsRecord) => {
          res.render('fieldReviewCreate', {
            title: 'Add Field-Review',
            officers,
            ADAPathwaySearchResult: ADAPathwaySearchResult[0],
            tripRequestsId: req.query.tripRequestsId,
            lat: req.query.lat,
            lon: req.query.lon,
            leg: req.query.leg,
            step: req.query.step,
            mode: req.query.mode,
            search_result_count: tripSearchResultCount,
            tripRequestData,
            settingsRecord,
            cipherKey1: process.env.PASS_CIPHER_KEY,
          });
        });
      });
    });
  });
};

// Handle Field Review create on POST.
exports.fieldReviews_create_post = function fieldReviewsController(req, res) {
  const attributes = buildAttributes(null, req.body.fieldReviewData);
  req.database.FieldReviewModel.create(attributes)
    .then((checkRecord) => {
      if (checkRecord) {
        res.send({ s_status: 'Record saved', newFieldReviewID: checkRecord.id, mapNoteId: checkRecord.mapNoteId });
      } else {
        res.send({ s_status: 'Record not created Error' });
      }
    });
};

// Display Field Review delete form on GET.
exports.fieldReviews_delete_get = function fieldReviewsController(req, res) {
  if (req.params.id) {
    req.database.FieldReviewModel.findAll({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      where: { id: req.params.id },
      include: [{ model: req.database.TripRequestModel,
        include: [{ model: req.database.ClientProfileModel }],
      }, { model: req.database.OfficerModel }],
    }).then((fieldReviewSearchResult) => {
      const fieldReviewResultCount = fieldReviewSearchResult.length;
      const fieldReviewData = JSON.parse(JSON.stringify(fieldReviewSearchResult));
      res.render('fieldReviewDelete', {
        title: 'Field Review Delete/Restore Record',
        fieldReviewResultCount,
        fieldReviewData,
      });
    });
  } else { res.render('fieldReviewDelete', { title: 'Field Review Delete/Restore Record' }); }
};

// Handle Desktop Review delete on POST.
exports.fieldReviews_delete_post = function fieldReviewsController(req, res) {
  let permanentDelete;
  let resultMessage;
  if (req.body.permanentDelete === 'true') {
    permanentDelete = true;
  } else { permanentDelete = false; }
  req.database.FieldReviewModel.findOne({
    paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
    where: { id: req.params.id },
  }).then((fieldReviewSearchResult) => {
    // To check this is Paranoid/soft Delete
    if (fieldReviewSearchResult.deletedAt === null) {
      req.database.FieldReviewModel.destroy({
        force: permanentDelete,
        where: { id: req.params.id },
      })
        .then((status) => {
          if ((status === 1) && (permanentDelete)) { resultMessage = 'Record Permanently Deleted !';
          } else if ((status === 1) && (!permanentDelete)) { resultMessage = 'Record Deleted !';
          } else { resultMessage = 'Error Processing Record'; }
          res.render('fieldReviewDelete', { s_status: resultMessage });
        });
    } else {
      req.database.FieldReviewModel.restore({
        force: req.body.permanentDelete,
        where: { id: req.params.id },
      })
        .then((status) => {
          if (status === 1) { resultMessage = 'Record Restored'; }
          else { resultMessage = 'Error Processing Record'; }
          res.render('fieldReviewDelete', { s_status: resultMessage });
        });
    }
  });
};

// Display Field Review update form on GET.
exports.fieldReviews_update_get = function fieldReviewsController(req, res) {
  if (req.query.fieldReviewId) {
    req.database.FieldReviewModel.findAll({
      where: { id: req.query.fieldReviewId },
      include: [{ model: req.database.TripRequestModel,
        include: [{ model: req.database.ClientProfileModel }],
      }, { model: req.database.OfficerModel }],
    }).then((fieldReviewSearchResult) => {
      const fieldReviewResultCount = fieldReviewSearchResult.length;
      const fieldReviewData = JSON.parse(JSON.stringify(fieldReviewSearchResult));
      res.render('fieldReviewUpdate', {
        title: 'Field Review Details',
        fieldReviewResultCount,
        fieldReviewData,
      });
    });
  } else { res.render('fieldReviewUpdate', { title: 'Field Review Details' }); }
};

// Handle Field Review update on POST.
exports.fieldReviews_update_post = function fieldReviewsController(req, res) {
  let completeDate = req.body.reviewCompleteDate;
  if (req.body.reviewCompleteDate === '') { completeDate = null; } else { completeDate = req.body.reviewCompleteDate; }
  const attributes = buildAttributes(completeDate, req.body);
  req.database.FieldReviewModel.update(attributes,
    { returning: true, where: { id: req.body.fieldReviewId } })
    .then(([rowsUpdate, [updatedRecord]]) => {
      if (rowsUpdate === 1) {
        req.database.FieldReviewModel.findAll({
          where: { id: req.query.fieldReviewId },
          include: [{
            model: req.database.TripRequestModel,
            include:
            [{ model: req.database.ClientProfileModel }],
          },
          { model: req.database.OfficerModel }],
        }).then((fieldReviewSearchResult) => {
          const fieldReviewResultCount = fieldReviewSearchResult.length;
          const fieldReviewData = JSON.parse(JSON.stringify(fieldReviewSearchResult));
          res.render('fieldReviewUpdate', {
            title: 'Field Review Details',
            fieldReviewResultCount,
            fieldReviewData,
            s_status: 'Record updated',
            s_detail: updatedRecord,
          });
        });
      } else {
        res.render('fieldReviewUpdate', { s_status: 'Error updating record' });
      }
    });
};

// Display detail page for a specific .
exports.fieldReviews_detail = function fieldReviewsController(req, res) {
  res.send(`NOT IMPLEMENTED: parameter passed after route (:id or /): ${req.params.id}`);
};
