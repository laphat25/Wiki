// ============================================
// db/init.js — Initialize database (migrate + seed)
// Usage: npm run db:init
// ============================================

const fs = require('fs');
const path = require('path');
const config = require('../config');
const { close } = require('./connection');
const { runMigrations } = require('./migrate');
const { runSeed } = require('./seed');
const logger = require('../utils/logger');

function init() {
  const dataDir = path.dirname(config.db.path);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    logger.info({ dataDir }, 'Created data directory');
  }

  runMigrations();
  const count = runSeed();

  console.log('\n Database initialized successfully!');
  console.log(`   Path:    ${config.db.path}`);
  console.log(`   Movies:  ${count}`);
  console.log(`   Run:     npm run db:bootstrap  (create admin account)\n`);
}

if (require.main === module) {
  try {
    init();
  } catch (err) {
    console.error('Database init failed:', err.message);
    process.exit(1);
  } finally {
    close();
  }
}

module.exports = { init };
