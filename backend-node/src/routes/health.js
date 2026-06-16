// ============================================
// routes/health.js — Health monitoring endpoint
// ============================================

const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const config = require('../config');

router.get('/', (_req, res) => {
  let dbStatus = 'ok';
  try {
    db.queryOne('SELECT 1 AS ok');
  } catch {
    dbStatus = 'error';
  }

  const status = dbStatus === 'ok' ? 'ok' : 'degraded';
  res.status(status === 'ok' ? 200 : 503).json({
    status,
    time: new Date().toISOString(),
    uptime: process.uptime(),
    env: config.env,
    database: dbStatus,
    version: require('../../package.json').version,
  });
});

module.exports = router;
