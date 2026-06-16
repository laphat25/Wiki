// ============================================
// routes/updateMovie.js
// ============================================

const express = require('express');
const router = express.Router();
const movieService = require('../services/movieService');
const { requireLogin, requireEditor } = require('../middleware/auth');
const logger = require('../utils/logger');

router.patch('/:id/update', requireLogin, requireEditor, (req, res) => {
  try {
    const { field, value } = req.body || {};
    const result = movieService.updateMovieField(req.params.id, field, value);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'updateMovie error');
    res.status(500).json({ error: 'Database error: ' + err.message });
  }
});

module.exports = router;
