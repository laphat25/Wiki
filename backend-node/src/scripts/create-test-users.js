// ============================================
// scripts/create-test-users.js
// ============================================

require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../db/connection');
const userRepository = require('../repositories/userRepository');

async function createAccounts() {
  const accounts = [
    { username: 'admin', email: 'admin@example.com', password: 'adminpass', role: 'admin' },
    { username: 'editor', email: 'editor@example.com', password: 'editorpass', role: 'editor' },
    { username: 'person', email: 'person@example.com', password: 'personpass', role: 'user' }
  ];

  for (const acc of accounts) {
    const existing = userRepository.findByUsernameOrEmailConflict(acc.username, acc.email);
    if (existing) {
      db.query('DELETE FROM users WHERE id = $1', [existing.id]);
      console.log(`Cleared existing user: ${acc.username}`);
    }
    const hash = await bcrypt.hash(acc.password, 12);
    const user = userRepository.create({
      username: acc.username,
      email: acc.email,
      passwordHash: hash,
      role: acc.role
    });
    console.log(`Created user: ${user.username} (role: ${user.role}) - Password: ${acc.password}`);
  }
}

createAccounts()
  .then(() => {
    console.log('\nAll test users created successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to create users:', err);
    process.exit(1);
  })
  .finally(() => db.close());
