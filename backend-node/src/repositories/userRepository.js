// ============================================
// repositories/userRepository.js
// ============================================

const db = require('../db/connection');

function findByUsernameOrEmail(login, isEmail) {
  const field = isEmail ? 'email' : 'username';
  return db.queryOne(
    `SELECT id, username, email, password_hash, role FROM users WHERE ${field} = $1 LIMIT 1`,
    [login]
  );
}

function findByUsernameOrEmailConflict(username, email) {
  return db.queryOne(
    'SELECT id FROM users WHERE username = $1 OR email = $2 LIMIT 1',
    [username, email]
  );
}

function create({ username, email, passwordHash, role = 'user' }) {
  const result = db.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4)',
    [username, email, passwordHash, role]
  );
  return db.queryOne(
    'SELECT id, username, email, role FROM users WHERE id = $1',
    [result.lastInsertRowid]
  );
}

function countByRole(role) {
  const row = db.queryOne('SELECT COUNT(*) AS count FROM users WHERE role = $1', [role]);
  return row?.count || 0;
}

module.exports = {
  findByUsernameOrEmail,
  findByUsernameOrEmailConflict,
  create,
  countByRole,
};
