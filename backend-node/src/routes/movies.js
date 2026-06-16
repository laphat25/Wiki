// ============================================
// routes/movies.js
// ============================================

const express = require('express');
const router = express.Router();
const movieService = require('../services/movieService');
const { requireLogin, requireAdmin, requireEditor } = require('../middleware/auth');
const logger = require('../utils/logger');

router.get('/', (req, res) => {
  try {
    const result = movieService.listMovies(req.query);
    res.json(result);
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'movies GET error');
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const result = movieService.getMovieById(req.params.id);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    res.json(result.movie);
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'movie/:id GET error');
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireLogin, requireEditor, (req, res) => {
  try {
    const result = movieService.updateMovie(req.params.id, req.body || {});
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'movie/:id PUT error');
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireLogin, requireEditor, (req, res) => {
  try {
    const result = movieService.createMovie(req.body || {});
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    res.status(201).json(result);
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'movies POST error');
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireLogin, requireEditor, (req, res) => {
  try {
    const result = movieService.deleteMovie(req.params.id);
    if (result.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }
    res.json(result);
  } catch (err) {
    logger.error({ err, requestId: req.id }, 'movies DELETE error');
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


