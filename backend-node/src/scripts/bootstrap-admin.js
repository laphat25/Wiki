// ============================================
// scripts/bootstrap-admin.js — Create first admin/editor account
// Usage: npm run db:bootstrap
//   ADMIN_USERNAME=admin ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=secret ADMIN_ROLE=admin
// ============================================

require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcrypt');
const { runMigrations } = require('../db/migrate');
const userRepository = require('../repositories/userRepository');
const { close } = require('../db/connection');

const VALID_ROLES = new Set(['admin', 'editor']);

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function bootstrap() {
  runMigrations();

  let username = process.env.ADMIN_USERNAME;
  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;
  let role = process.env.ADMIN_ROLE || 'admin';

  if (!username) username = await prompt('Admin username: ');
  if (!email) email = await prompt('Admin email: ');
  if (!password) password = await prompt('Admin password (min 8 chars): ');

  if (!username || username.length < 3) {
    throw new Error('Username must be at least 3 characters');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Invalid email');
  }
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
  if (!VALID_ROLES.has(role)) {
    throw new Error('Role must be admin or editor');
  }

  const existing = userRepository.findByUsernameOrEmailConflict(username, email);
  if (existing) {
    throw new Error('Username or email already exists');
  }

  const hash = await bcrypt.hash(password, 12);
  const user = userRepository.create({
    username,
    email,
    passwordHash: hash,
    role,
  });

  console.log(`\n✅ ${role} account created successfully!`);
  console.log(`   ID:       ${user.id}`);
  console.log(`   Username: ${user.username}`);
  console.log(`   Email:    ${user.email}`);
  console.log(`   Role:     ${user.role}\n`);
}

if (require.main === module) {
  bootstrap()
    .catch((err) => {
      console.error('❌ Bootstrap failed:', err.message);
      process.exit(1);
    })
    .finally(() => close());
}

module.exports = { bootstrap };
