// ============================================
// routes/comments.js
// ============================================

const express = require('express');
const router = express.Router();
const commentService = require('../services/commentService');
const { requireLogin } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', (req, res) => {
  try {
    const result = commentService.listComments(req.query.movie_id, req.query);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'comments GET error');
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireLogin, (req, res) => {
  try {
    const result = commentService.createComment(req.session.user, req.body || {});
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.status(result.status).json({ success: true, comment: result.comment });
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'comments POST error');
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireLogin, (req, res) => {
  try {
    const result = commentService.deleteComment(req.session.user, req.params.id);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'comments DELETE error');
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
