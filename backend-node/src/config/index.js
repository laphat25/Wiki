// ============================================
// config/index.js — Environment-based configuration
// ============================================

require('dotenv').config();
const path = require('path');
const crypto = require('crypto');

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';

const SESSION_SECRET = process.env.SESSION_SECRET || '';
const DEV_FALLBACK_SECRET = 'doraemon_wiki_dev_secret_local_only';

function resolveSessionSecret() {
  if (SESSION_SECRET && SESSION_SECRET.length >= 32) {
    return SESSION_SECRET;
  }
  if (isProduction) {
    console.error('❌ FATAL: SESSION_SECRET must be set and at least 32 characters in production.');
    process.exit(1);
  }
  if (isTest) {
    return 'test_session_secret_at_least_32_chars!!';
  }
  console.warn('⚠️  Using dev SESSION_SECRET — set a strong secret before production.');
  return SESSION_SECRET || DEV_FALLBACK_SECRET;
}

function parseOrigins(value) {
  if (!value || value.trim() === '*') return '*';
  return value.split(',').map((o) => o.trim()).filter(Boolean);
}

const config = {
  env: NODE_ENV,
  isProduction,
  isTest,
  port: parseInt(process.env.PORT || '3000', 10),

  db: {
    path: process.env.DATABASE_PATH
      || path.join(__dirname, '../../data/database.sqlite'),
  },

  session: {
    secret: resolveSessionSecret(),
    storePath: process.env.SESSION_DB_PATH
      || path.join(__dirname, '../../data/sessions.sqlite'),
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  },

  cors: {
    origins: parseOrigins(process.env.CORS_ORIGINS || ''),
    credentials: true,
  },

  uploads: {
    dir: path.join(__dirname, '../../uploads'),
    maxSize: 2 * 1024 * 1024,
  },

  rateLimit: {
    auth: {
      windowMs: 15 * 60 * 1000,
      max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '20', 10),
    },
  },

  log: {
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  },
};

module.exports = config;
