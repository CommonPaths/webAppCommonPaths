// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');
const accessControlService = require('../services/accessControlService');

// GET index for data pipeline.
exports.dataPipeline_index = function dataPipelineController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'dataPipeline');
  if (permission.granted) {
    req.database.SettingModel.findByPk(1).then((settingsRecord) => {
      res.render('datapipelinelanding', { settingsRecord });
    });
  } else {
    res.status(403).end();
  }
};

// GET import for data pipeline.
exports.dataPipeline_import_get = function dataPipelineController(req, res) {
  const permission = accessControlService.checkReadAllAccess(req.signedCookies.token.officer_role, 'dataPipeline');
  if (permission.granted) {
    req.database.SettingModel.findByPk(1).then((settingsRecord) => {
      res.render('datapipeline', {
        settingsRecord,
      });
    });
  } else {
    res.status(403).end();
  }
};

// GET export for data pipeline.
exports.dataPipeline_export_get = function dataPipelineController(req, res) {
  res.send('NOT IMPLEMENTED: Site Page');
};

exports.dataPipeline_trigger_get = function triggerOTPGraph(req, res) {
  
  const permission = accessControlService.checkReadAllAccess(
    req.signedCookies.token.officer_role,
    'dataPipeline'
  );
  if (permission.granted) {
    req.database.SettingModel.findByPk(1).then((settingsRecord) => {
      res.render('otpgraph', {
        s3AccessKeyId: process.env.OTP_S3_ACCESS_KEY_ID,
        s3SecretAccessKey: process.env.OTP_S3_SECRET_KEY,
        s3Region: process.env.OTP_S3_REGION,
        s3BucketName: process.env.OTP_S3_BUCKET_NAME,
        loggedinUser: JSON.stringify(res.locals.user['username']),
        lambdaFunctionName: process.env.OTP_LAMBDA_FUNCTION_NAME,
      });
    });
  } else {
    res.status(403).end();
  }
};
