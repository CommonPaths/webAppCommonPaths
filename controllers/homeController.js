// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

const { Op } = require('sequelize');

function promiseSettingModel(req) {
  return req.database.SettingModel.findByPk(1);
}

function promiseDesktopReviewCountByUser(req) {
  return req.database.DesktopReviewModel.count({
    where: {
      [Op.and]: [
        { status: { [Op.not]: 'Completed' } },
        { officersId: { [Op.eq]: req.signedCookies.token.officer_id } },
      ],
    },
  });
}

function promiseDesktopReviewCountTotal(req) {
  return req.database.DesktopReviewModel.count({
    where: {
      status: { [Op.not]: 'Completed' },
    },
  });
}

function promiseFieldReviewCountByUser(req) {
  return req.database.FieldReviewModel.count({
    where: {
      [Op.and]: [
        { status: { [Op.not]: 'Completed' } },
        { officersId: { [Op.eq]: req.signedCookies.token.officer_id } },
      ],
    },
  });
}

function promiseFieldReviewCountTotal(req) {
  return req.database.FieldReviewModel.count({
    where: {
      status: { [Op.not]: 'Completed' },
    },
  });
}

function promiseTripRequestCountByUser(req) {
  return req.database.TripRequestModel.count({
    where: {
      [Op.and]: [
        { status: { [Op.or]: ['Under_Review', null] } },
        { officersId: { [Op.eq]: req.signedCookies.token.officer_id } },
      ],
    },
  });
}

function promiseTripRequestCountTotal(req) {
  return req.database.TripRequestModel.count({
    where: {
      [Op.or]: [
        { status: 'Under_Review' },
        { status: null },
      ],
    },
  });
}

exports.dashboardList = function homeController(req, res) {
  Promise.all([
    promiseSettingModel(req), // 0
    promiseDesktopReviewCountByUser(req), // 1
    promiseDesktopReviewCountTotal(req), // 2
    promiseFieldReviewCountByUser(req), // 3
    promiseFieldReviewCountTotal(req), // 4
    promiseTripRequestCountByUser(req), // 5
    promiseTripRequestCountTotal(req), // 6
  ]).then((values) => {
    if (values[0] !== null) {
      res.render('home', {
        loggedUser: JSON.stringify(res.locals.user['cognito:username']),
        loggedUserMessage: ' This is the Logged User: ',
        settingsRecord: values[0],
        getLoggedUserRole: req.signedCookies.token.officer_role,
        desktopReviewCountByUser: values[1],
        desktopReviewCountTotal: values[2],
        fieldReviewCountByUser: values[3],
        fieldReviewCountTotal: values[4],
        tripRequestCountByUser: values[5],
        tripRequestCountTotal: values[6],
      });
    } else {
      res.redirect('/settings/general');
    }
  });
};
