// ============================================
// db/migrate.js — Migration runner
// ============================================

const fs = require('fs');
const path = require('path');
const { getDb, close } = require('./connection');
const logger = require('../utils/logger');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

function ensureMigrationsTable(database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function getAppliedMigrations(database) {
  return new Set(
    database.prepare('SELECT name FROM schema_migrations ORDER BY id').all().map((r) => r.name)
  );
}

// Function exported for startup/tests
function runMigrations() {
  const database = getDb();
  ensureMigrationsTable(database);

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const applied = getAppliedMigrations(database);
  let count = 0;

  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    logger.info({ migration: file }, 'Applying migration');

    const run = database.transaction(() => {
      database.exec(sql);
      database.prepare('INSERT INTO schema_migrations (name) VALUES (?)').run(file);
    });
    run();
    count += 1;
  }

  logger.info({ applied: count, total: files.length }, 'Migrations complete');
  return count;
}

if (require.main === module) {
  try {
    runMigrations();
  } finally {
    close();
  }
}

module.exports = { runMigrations };
