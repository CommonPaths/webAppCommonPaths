// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const { Op } = require('sequelize');
const accessControlService = require('../services/accessControlService');

function promiseTripRequestCountCompletedByDateRange(req) {
  return req.database.TripRequestModel.count({
    where: {
      [Op.and]: [
        { status: { [Op.ne]: 'Under_Review' } },
        { status: { [Op.ne]: null } },
        { dateCompleted: { [Op.gte]: req.body.reportStartDate } },
        { dateCompleted: { [Op.lte]: req.body.reportEndDate } },
      ],
    },
  });
}

function promiseTripRequestCountAdaPathwayByDateRange(req) {
  return req.database.TripRequestModel.count({
    where: {
      [Op.and]: [
        { status: { [Op.eq]: 'ADA_Pathway' } },
        { dateCompleted: { [Op.gte]: req.body.reportStartDate } },
        { dateCompleted: { [Op.lte]: req.body.reportEndDate } },
      ],
    },
  });
}

function promiseTripRequestCountNoAdaPathwayByDateRange(req) {
  return req.database.TripRequestModel.count({
    where: {
      [Op.and]: [
        { status: { [Op.eq]: 'Access' } },
        { dateCompleted: { [Op.gte]: req.body.reportStartDate } },
        { dateCompleted: { [Op.lte]: req.body.reportEndDate } },
      ],
    },
  });
}

function promiseDesktopReviewWithoutFieldReviewByDateRange(req) {
  return req.database.TripRequestModel.count({
    where: {
      [Op.and]: [
        { '$DesktopReviewModels.status$': { [Op.eq]: 'Completed' } },
        { '$DesktopReviewModels.reviewCompleteDate$': { [Op.gte]: req.body.reportStartDate } },
        { '$DesktopReviewModels.reviewCompleteDate$': { [Op.lte]: req.body.reportEndDate } },
        { '$FieldReviewModels.id$': { [Op.eq]: null } },
      ],
    },
    include: [
      {
        model: req.database.DesktopReviewModel,
        required: false,
      },
      {
        model: req.database.FieldReviewModel,
        required: false,
      },
    ],
  });
}

function promiseTripRequestCountFieldReviewByDateRange(req) {
  return req.database.FieldReviewModel.count({
    where: {
      [Op.and]: [
        { status: { [Op.eq]: 'Completed' } },
        { reviewCompleteDate: { [Op.gte]: req.body.reportStartDate } },
        { reviewCompleteDate: { [Op.lte]: req.body.reportEndDate } },
      ],
    },
  });
}

function promiseTripRequestCountOfficerDesktopReviewByDateRange(req) {
  return req.database.TripRequestModel.count({
    where: {
      [Op.and]: [
        { '$DesktopReviewModels.officersId$': { [Op.eq]: req.body.officersId } },
        { '$DesktopReviewModels.status$': { [Op.eq]: 'Completed' } },
        { '$DesktopReviewModels.reviewCompleteDate$': { [Op.gte]: req.body.reportStartDate } },
        { '$DesktopReviewModels.reviewCompleteDate$': { [Op.lte]: req.body.reportEndDate } },
        { '$FieldReviewModels.id$': { [Op.eq]: null } },
      ],
    },
    include: [
      {
        model: req.database.DesktopReviewModel,
        required: false,
      },
      {
        model: req.database.FieldReviewModel,
        required: false,
      },
    ],
  });
}

function promiseTripRequestCountOfficerFieldReviewByDateRange(req) {
  return req.database.FieldReviewModel.count({
    where: {
      [Op.and]: [
        { officersId: { [Op.eq]: req.body.officersId } },
        { status: { [Op.eq]: 'Completed' } },
        { reviewCompleteDate: { [Op.gte]: req.body.reportStartDate } },
        { reviewCompleteDate: { [Op.lte]: req.body.reportEndDate } },
      ],
    },
  });
}

// GET reports.
exports.reports_get = function reportsController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'reports');
  if (permission.granted) {
    req.database.OfficerModel.findAll({ where: { active: true } }).then((officers) => {
      res.render('reports', {
        officers,
        getLoggedUserRole: req.signedCookies.token.officer_role,
      });
    });
  } else {
    res.status(403).end();
  }
};

// POST reports.
exports.reports_post = function reportsController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'reports');
  if (permission.granted) {
    req.database.OfficerModel.findAll({ where: { active: true } }).then((officers) => {
      Promise.all([
        promiseTripRequestCountCompletedByDateRange(req),
        promiseTripRequestCountAdaPathwayByDateRange(req),
        promiseTripRequestCountNoAdaPathwayByDateRange(req),
        promiseDesktopReviewWithoutFieldReviewByDateRange(req),
        promiseTripRequestCountFieldReviewByDateRange(req),
        promiseTripRequestCountOfficerDesktopReviewByDateRange(req),
        promiseTripRequestCountOfficerFieldReviewByDateRange(req),
      ]).then((values) => {
        if (values[0] !== null) {
          res.render('reports', {
            officers,
            tripRequestCountReport: values[0],
            adaPathwayCountReport: values[1],
            noAdaPathwayCountReport: values[2],
            desktopReviewWithoutFieldReviewCountReport: values[3],
            fieldReviewCountReport: values[4],
            officerDesktopReviewCountReport: values[5],
            officerFieldReviewCountReport: values[6],
          });
        }
      });
    });
  } else {
    res.status(403).end();
  }
};