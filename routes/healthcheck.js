const express = require('express');

const router = express.Router();

router.get('/', (_req, res, _next) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  };
  try {
    res.json(healthcheck);
  } catch (e) {
    healthcheck.message = e;
    res.status(503).send();
  }
});

module.exports = router;
