// ============================================
// db/connection.js — SQLite adapter (swappable for PostgreSQL later)
// ============================================

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const config = require('../config');
const logger = require('../utils/logger');

let db = null;

/**
 * Convert pg-style $1, $2 placeholders to SQLite ? placeholders.
 */
function toSqliteParams(sql, params = []) {
  let index = 0;
  const converted = sql.replace(/\$(\d+)/g, () => {
    index += 1;
    return '?';
  });
  return { sql: converted, params };
}

function ensureDataDir() {
  const dir = path.dirname(config.db.path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getDb() {
  if (!db) {
    ensureDataDir();
    db = new Database(config.db.path);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    logger.info({ path: config.db.path }, 'SQLite database connected');
  }
  return db;
}

/**
 * pg-compatible query interface for repositories.
 * SELECT → { rows: [...] }
 * INSERT/UPDATE/DELETE → { rows: [], rowCount: n, lastInsertRowid }
 */
function query(sql, params = []) {
  const database = getDb();
  const { sql: converted, params: bound } = toSqliteParams(sql, params);
  const trimmed = converted.trim().toUpperCase();

  if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
    const stmt = database.prepare(converted);
    const rows = stmt.all(...bound);
    return { rows, rowCount: rows.length };
  }

  const stmt = database.prepare(converted);
  const result = stmt.run(...bound);
  return {
    rows: [],
    rowCount: result.changes,
    lastInsertRowid: result.lastInsertRowid,
  };
}

function queryOne(sql, params = []) {
  const { rows } = query(sql, params);
  return rows[0] || null;
}

function close() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  getDb,
  query,
  queryOne,
  close,
  toSqliteParams,
};
