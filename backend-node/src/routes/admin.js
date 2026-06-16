// ============================================
// routes/admin.js
// ============================================

const express = require('express');
const router = express.Router();
const { requireLogin, requireAdmin } = require('../middleware/auth');
const db = require('../db/connection');

router.get('/stats', requireLogin, requireAdmin, (req, res) => {
  try {
    const stats = db.queryOne("SELECT value FROM site_stats WHERE key = 'total_views'");
    const commentsCount = db.queryOne("SELECT COUNT(*) AS total FROM comments");
    const moviesCount = db.queryOne("SELECT COUNT(*) AS total FROM movies");
    res.json({
      total_views: stats?.value || 0,
      total_comments: commentsCount?.total || 0,
      total_movies: moviesCount?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/comments', requireLogin, requireAdmin, (req, res) => {
  try {
    const { rows } = db.query(
      `SELECT c.id, c.movie_id, c.user_id, c.body, c.rating, c.name, c.email, c.created_at, m.title_vi AS movie_title, u.username
       FROM comments c
       LEFT JOIN movies m ON m.id = c.movie_id
       LEFT JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC`
    );
    res.json({ success: true, comments: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
