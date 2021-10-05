const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk');

AWS.config.update({
  region: process.env.COGNITO_REGION,
  accessKeyId: process.env.COGNITO_ACCESS_KEY,
  secretAccessKey: process.env.COGNITO_SECRET_KEY,
});

const poolData = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID,
  ClientId: process.env.COGNITO_CLIENT_ID,
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function buildCognitoUser(username, userpool) {
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: username,
    Pool: userpool,
  });
  return cognitoUser;
}

function buildAuthenticationDetails(username, password) {
  const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: username,
    Password: password,
  });
  return authenticationDetails;
}

const registerUser = (username, password, email) => {
  const attributeList = [];

  const dataEmail = {
    Name: 'email',
    Email: email,
  };

  const attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

  attributeList.push(attributeEmail);

  userPool.signUp(username, password, attributeList, null, (err, result) => {
    if (err) console.log(err.message || JSON.stringify(err));
    const cognitoUser = result.user;
    console.log(`user name is ${cognitoUser.getUsername()}`);
  });
};

const userSignIn = (username, password) => new Promise((resolve, reject) => {
  const payload = {};
  const authenticationDetails = buildAuthenticationDetails(username, password);
  const cognitoUser = buildCognitoUser(username, userPool);

  cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      payload.accessToken = result.getAccessToken().getJwtToken();
      cognitoUser.getUserAttributes((err, attrs) => {
        attrs.forEach((attr) => (payload[attr.Name] = attr.Value));
        payload.jwt = result.getIdToken().getJwtToken();
        payload.username = result.accessToken.payload.username;
        resolve({ payload });
      });
    },
    onFailure: (err) => {
      resolve({ payload: 'invalid', err });
    },
    newPasswordRequired: () => {
    },
  });
});

const updateUserPassword = (username, newPassword, oldPassword) => {
  const authenticationDetails = buildAuthenticationDetails(username, oldPassword);
  const cognitoUser = buildCognitoUser(username, userPool);

  cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess(result) {
      cognitoUser.changePassword(oldPassword, newPassword, (err, _inResult) => {
        if (err) return (err.message || JSON.stringify(err));
      });
      return (result);
    },
    onFailure(err) {
      return (err);
    },
    newPasswordRequired: (userAttributes) => {
      // eslint-disable-next-line no-param-reassign
      delete userAttributes.email_verified;

      cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
        onSuccess(result) {
          return (result);
        },
        onFailure(err) {
          return (err);
        },
      });
    },
  });
};

const addUserToGroup = (groupName, userName) => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  const params = {
    GroupName: groupName,
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: userName,
  };
  cognitoidentityserviceprovider.adminAddUserToGroup(params, (err, data) => {
    // TODO log to logger instead of to console cotogno
    if (err) console.log(err, err.stack);
    else console.log('User added to group.');
  });
};

const adminDeleteUser = (userName) => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  cognitoidentityserviceprovider.adminDeleteUser({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: userName,
  }, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log('User Deleted');
  });
};

const registerUserWithTmpPassword = (email, cognitoGroup, req) => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  cognitoidentityserviceprovider.adminCreateUser({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Username: email,
    TemporaryPassword: `G1${Math.random().toString(36).substring(2, 15)}`,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
  }, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
      addUserToGroup(cognitoGroup, email);
      // data['User']['Attributes'][0].Value returns the cognitoSub for the user from Cognito
      req.database.OfficerModel.update({ cognitoSub: data['User']['Attributes'][0].Value },
        { returning: true, where: { eMail: req.body.eMail } });
      return data;
    }
  });
};

const resetPasswordRequest = (username, res) => {
  const cognitoUser = buildCognitoUser(username, userPool);

  cognitoUser.forgotPassword({
    onSuccess(data) {
      res.render('index', { s_status: 'Reset Request Sent' });
    },
    onFailure(err) {
      res.render('index', { s_status: err });
    },
  });
};

const resetPassword = (username, verficationCode, newPassword, res) => {
  const cognitoUser = buildCognitoUser(username, userPool);

  cognitoUser.confirmPassword(verficationCode, newPassword, {
    onSuccess(data) {
      res.render('index', { s_status: 'Info Updated' });
    },
    onFailure(err) {
      res.render('index', { s_status: err });
    },
  });
};

const globalSignOut = (username, res) => {
  const cognitoUser = buildCognitoUser(username, userPool);

  cognitoUser.globalSignOut({
    onSuccess() {
      res.render('index');
    },
    onFailure(err) {
      res.render('index', { s_status: err });
    },
  });
};

exports.userSignIn = userSignIn;
exports.registerUser = registerUser;
exports.updateUserPassword = updateUserPassword;
exports.addUserToGroup = addUserToGroup;
exports.adminDeleteUser = adminDeleteUser;
exports.registerUserWithTmpPassword = registerUserWithTmpPassword;
exports.resetPasswordRequest = resetPasswordRequest;
exports.resetPassword = resetPassword;
exports.globalSignOut = globalSignOut;