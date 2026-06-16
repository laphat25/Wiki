// ============================================
// middleware/rateLimit.js — Rate limiting for auth routes
// ============================================

const rateLimit = require('express-rate-limit');
const config = require('../config');

const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

module.exports = { authRateLimiter };
