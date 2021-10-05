const CognitoExpress = require('cognito-express');

const cognitoExpress = new CognitoExpress({
  region: process.env.COGNITO_REGION,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  tokenUse: 'access',
  tokenExpiration: process.env.COGNITO_TOKEN_EXPIRATION,
});

module.exports = () => (req, res, next) => {
  res.cookie('returnTo', req.originalUrl, { maxAge: '300000', httpOnly: true, signed: true }); // 5 Min cookie MaxAge
  
  if (typeof (req.signedCookies.token) === 'undefined') {
    res.redirect('/login');
    return;
  }

  const { accessToken } = req.signedCookies.token.payload;

  if (!accessToken) return res.redirect('/login');

  // eslint-disable-next-line consistent-return
  cognitoExpress.validate(accessToken, (err, response) => {
    if (err) { 
      res.redirect('/login');
      return;
    }
    const tenantDomain = req.subdomains[process.env.SUBDOMAIN_ARRAY_INDEX];
    const userTenants = response['cognito:groups'];
    if ((userTenants === undefined || userTenants.length === 0)) {
      res.redirect('/invalid_tenant');
      return;
    } else if (!userTenants.includes(tenantDomain)) {
      res.redirect('/invalid_tenant');
      return;
    }
    res.locals.user = response;
    res.locals.user.username = response.username;
    res.locals.user.role = response.officer_role;
    next();
  });
};
