// ============================================
// repositories/commentRepository.js
// ============================================

const db = require('../db/connection');

function findByMovieId(movieId, { limit, offset } = {}) {
  if (limit != null && offset != null) {
    const countRow = db.queryOne(
      'SELECT COUNT(*) AS total FROM comments WHERE movie_id = $1',
      [movieId]
    );
    const { rows } = db.query(
      `SELECT c.id, c.movie_id, c.user_id, c.body, c.rating, c.name, c.email, c.created_at, u.username
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.movie_id = $1
       ORDER BY c.created_at DESC
       LIMIT $2 OFFSET $3`,
      [movieId, limit, offset]
    );
    return { rows, total: countRow?.total || 0 };
  }

  const { rows } = db.query(
    `SELECT c.id, c.movie_id, c.user_id, c.body, c.rating, c.name, c.email, c.created_at, u.username
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.movie_id = $1
     ORDER BY c.created_at DESC`,
    [movieId]
  );
  return { rows, total: rows.length };
}

function findById(id) {
  return db.queryOne('SELECT id, user_id, movie_id FROM comments WHERE id = $1 LIMIT 1', [id]);
}

function create({ movieId, userId, body, rating, name, email }) {
  const result = db.query(
    'INSERT INTO comments (movie_id, user_id, body, rating, name, email) VALUES ($1, $2, $3, $4, $5, $6)',
    [movieId, userId, body, rating, name, email]
  );
  return db.queryOne(
    `SELECT c.id, c.movie_id, c.user_id, c.body, c.rating, c.name, c.email, c.created_at, u.username
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.id = $1`,
    [result.lastInsertRowid]
  );
}

function remove(id) {
  db.query('DELETE FROM comments WHERE id = $1', [id]);
}

module.exports = {
  findByMovieId,
  findById,
  create,
  remove,
};

