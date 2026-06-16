// ============================================
// routes/feedback.js
// ============================================

const express = require('express');
const router = express.Router();
const feedbackService = require('../services/feedbackService');
const logger = require('../utils/logger');

router.post('/', (req, res) => {
  try {
    const result = feedbackService.createFeedback(req.body || {});
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.status(result.status).json({ success: true, feedback: result.feedback });
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'feedback POST error');
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
