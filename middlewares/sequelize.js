const connections = require('../models/connection');

module.exports = () => (req, res, next) => {
  const subdomain = req.subdomains[process.env.SUBDOMAIN_ARRAY_INDEX];
  if (Object.keys(connections).includes(subdomain)) {
    req.database = connections[subdomain];
  } else {
    res.redirect('/invalid_tenant');
  }
  next();
};
