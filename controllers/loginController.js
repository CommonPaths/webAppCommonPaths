// const { NotAcceptable } = require('http-errors'); // TODO
// const { keys } = require('lodash');
const authService = require('../services/authService');
const cookieParser = require('cookie-parser');
// const { body,validationResult } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

exports.auth_get = function loginController(req, res) {
  res.clearCookie('username');
  res.clearCookie('token');
  res.render('index');
};
exports.auth_post = function loginController(req, res) {
  if ((req.body.userName) && (req.body.passWord)) {
    authService.userSignIn(req.body.userName, req.body.passWord).then((result) => {
      if (result.payload === 'invalid') {
        res.render('index', { s_status: 'Wrong Username and or Password!' });
      } else if (result.payload.jwt) {
        req.database.OfficerModel.findOne({
          where: { cognitoSub: result.payload.sub }}).then((queryResult) => {
          // eslint-disable-next-line no-param-reassign
          result.officer_role = queryResult ? queryResult.dataValues.officerRoles : 'no_role';
          // eslint-disable-next-line no-param-reassign
          result.officer_id = queryResult.dataValues.id;
          res.cookie('token', result, { maxAge: process.env.COGNITO_TOKEN_EXPIRATION, httpOnly: true, signed: true });
          res.redirect(req.signedCookies.returnTo || '/home');
          res.clearCookie('returnTo');
        });
      }
    });
  }
};

exports.forgot_pw_post = function loginController(req, res) {
  if (req.body.username !== '' && req.body.newPassword1 === undefined) {
    authService.resetPasswordRequest(req.body.username, res);
  } else if (req.body.vCode !== '' && req.body.newPassword1 === req.body.newPassword2) {
    authService.resetPassword(req.body.username, req.body.vCode, req.body.newPassword1, res);
  } else if (req.body.newPassword1 === req.body.newPassword2) {
    authService.updateUserPassword(req.body.username, req.body.newPassword1, req.body.tempPassword);
  } else if (req.body.newPassword1 !== req.body.newPassword2) {
    res.render('forgotpassword', { s_status: 'New Passwords Do Not Match.' });
  } else {
    res.render('forgotpassword', { s_status: 'Wrong Info Provided, Please Try Again.' });
  }
};

// GET for forgotpassword.
exports.forgot_get = function loginController(req, res) {
  res.render('forgotpassword');
};
