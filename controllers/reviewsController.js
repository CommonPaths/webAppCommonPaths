// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const { Op } = require('sequelize');
const moment = require('moment');
const accessControlService = require('../services/accessControlService');

function showParanoidRecords(loggedUserRole) {
  if (loggedUserRole === 'admin') { return false; }
  return true;
}

// Display list of Desktop and Field Reviews GET method
exports.index = function reviewsController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'desktopReviews');
  let desktopReviewsData;
  let fieldReviewsData;
  const daysDefaultFilter = 90;
  const dateStart = moment().subtract(daysDefaultFilter, 'days').format('YYYY-MM-DD HH:mm:ss');
  const dateEnd = moment().format('YYYY-MM-DD HH:mm:ss');

  if (permission.granted) {
    req.database.DesktopReviewModel.findAll({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      where: {
        [Op.and]: [
          { updatedAt: { [Op.gte]: dateStart } },
          { updatedAt: { [Op.lte]: dateEnd } },
        ],
      },
      include: [{ model: req.database.TripRequestModel,
        include: [{ model: req.database.ClientProfileModel }],
      }, { model: req.database.OfficerModel }],
      order: [
        ['updatedAt', 'DESC'],
      ],
    }).then((desktopReviews) => {
      desktopReviewsData = JSON.parse(JSON.stringify(desktopReviews));
      req.database.FieldReviewModel.findAll({
        paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
        where: {
          [Op.and]: [
            { updatedAt: { [Op.gte]: dateStart } },
            { updatedAt: { [Op.lte]: dateEnd } },
          ],
        },
        include: [{ model: req.database.TripRequestModel,
          include: [{ model: req.database.ClientProfileModel }],
        }, { model: req.database.OfficerModel }],
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then((fieldReviews) => {
        req.database.SettingModel.findByPk(1).then((settingsRecord) => {
          fieldReviewsData = JSON.parse(JSON.stringify(fieldReviews));
          res.render('reviews', { 
            dateStart: dateStart.split(' ')[0],
            dateEnd: dateEnd.split(' ')[0],
            desktopReviewsData, 
            fieldReviewsData, 
            getLoggedUserRole: req.signedCookies.token.officer_role,
            s3Region: settingsRecord.cognitoRegion,
            s3AccessKeyId: settingsRecord.s3AccessKeyId,
            s3SecretAccessKey: settingsRecord.s3SecretAccessKey,
            s3BucketName: settingsRecord.s3BucketName,
          });
        });
      });
    });
  } else {
    res.status(403).end();
  }
};

// Display list of Desktop and Field Reviews POST method
exports.index_post = function reviewsController(req, res) {
  const permission = accessControlService.checkUpdateAllAccess(req.signedCookies.token.officer_role, 'desktopReviews');
  let desktopReviewsData;
  let fieldReviewsData;
  let dateStart = req.body.dateStart + ' ' + moment().format('HH:mm:ss');
  let dateEnd = req.body.dateEnd + ' ' +  moment().format('HH:mm:ss');

  if (permission.granted) {
    req.database.DesktopReviewModel.findAll({
      paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
      where: {
        [Op.and]: [
          { updatedAt: { [Op.gte]: dateStart } },
          { updatedAt: { [Op.lte]: dateEnd } },
        ],
      },
      include: [{ model: req.database.TripRequestModel,
        include: [{ model: req.database.ClientProfileModel }],
      }, { model: req.database.OfficerModel }],
      order: [
        ['updatedAt', 'DESC'],
      ],
    }).then((desktopReviews) => {
      desktopReviewsData = JSON.parse(JSON.stringify(desktopReviews));
      req.database.FieldReviewModel.findAll({
        paranoid: showParanoidRecords(req.signedCookies.token.officer_role),
        where: {
          [Op.and]: [
            { updatedAt: { [Op.gte]: dateStart } },
            { updatedAt: { [Op.lte]: dateEnd } },
          ],
        },
        include: [{ model: req.database.TripRequestModel,
          include: [{ model: req.database.ClientProfileModel }],
        }, { model: req.database.OfficerModel }],
        order: [
          ['updatedAt', 'DESC'],
        ],
      }).then((fieldReviews) => {
        req.database.SettingModel.findByPk(1).then((settingsRecord) => {
          fieldReviewsData = JSON.parse(JSON.stringify(fieldReviews));
          res.render('reviews', { 
            dateStart: dateStart.split(' ')[0],
            dateEnd: dateEnd.split(' ')[0],
            desktopReviewsData, 
            fieldReviewsData, 
            getLoggedUserRole: req.signedCookies.token.officer_role,
            s3Region: settingsRecord.cognitoRegion,
            s3AccessKeyId: settingsRecord.s3AccessKeyId,
            s3SecretAccessKey: settingsRecord.s3SecretAccessKey,
            s3BucketName: settingsRecord.s3BucketName,
          });
        });
      });
    });
  } else {
    res.status(403).end();
  }
};
