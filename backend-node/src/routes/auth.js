// ============================================
// routes/auth.js
// ============================================

const express = require('express');
const router = express.Router();
const authService = require('../services/authService');
const { authRateLimiter } = require('../middleware/rateLimit');
const logger = require('../utils/logger');

router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const result = await authService.register(req.body || {});
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.status(result.status).json({ success: true, user: result.user });
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'register error');
    res.status(500).json({ error: 'Register failed' });
  }
});

router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const result = await authService.login(req.body || {});
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    const sessionUser = result.user;
    req.session.regenerate((regenErr) => {
      if (regenErr) {
        logger.error({ err: regenErr, requestId: req.id }, 'session regenerate failed');
        return res.status(500).json({ error: 'Login failed' });
      }
      req.session.user = sessionUser;
      req.session.save((saveErr) => {
        if (saveErr) {
          logger.error({ err: saveErr, requestId: req.id }, 'session save failed');
          return res.status(500).json({ error: 'Login failed' });
        }
        res.json({ success: true, user: sessionUser });
      });
    });
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'login error');
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

router.get('/me', (req, res) => {
  res.json({ user: req.session?.user ?? null });
});

module.exports = router;
