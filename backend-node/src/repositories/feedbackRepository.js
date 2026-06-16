// ============================================
// repositories/feedbackRepository.js
// ============================================

const db = require('../db/connection');

function create({ name, email, subject, message }) {
  const result = db.query(
    'INSERT INTO feedbacks (name, email, subject, message) VALUES ($1, $2, $3, $4)',
    [name, email, subject, message]
  );
  return db.queryOne(
    'SELECT id, name, email, subject, message, created_at FROM feedbacks WHERE id = $1',
    [result.lastInsertRowid]
  );
}

module.exports = {
  create,
};
