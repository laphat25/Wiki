// ============================================
// utils/logger.js — Structured logging with pino
// ============================================

const pino = require('pino');
const config = require('../config');

const logger = pino({
  level: config.log.level,
  ...(config.isProduction
    ? {}
    : {
        transport: {
          target: 'pino/file',
          options: { destination: 1 },
        },
      }),
});

module.exports = logger;
