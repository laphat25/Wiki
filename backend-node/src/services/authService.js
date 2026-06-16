// ============================================
// services/authService.js
// ============================================

const bcrypt = require('bcrypt');
const userRepository = require('../repositories/userRepository');

const USERNAME_RE = /^[a-zA-Z0-9_]{3,50}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

async function register({ username, email, password }) {
  const u = (username || '').trim();
  const e = (email || '').trim();
  const p = password || '';

  if (!u || u.length < 3 || u.length > 50) {
    return { error: 'Username must be 3–50 characters', status: 400 };
  }
  if (!USERNAME_RE.test(u)) {
    return { error: 'Username can contain letters, numbers, and underscore only', status: 400 };
  }
  if (!EMAIL_RE.test(e)) {
    return { error: 'Invalid email', status: 400 };
  }
  if (p.length < 8) {
    return { error: 'Password must be at least 8 characters', status: 400 };
  }

  const existing = userRepository.findByUsernameOrEmailConflict(u, e);
  if (existing) {
    return { error: 'Username or email already exists', status: 409 };
  }

  const hash = await bcrypt.hash(p, 12);
  const newUser = userRepository.create({ username: u, email: e, passwordHash: hash });

  return {
    success: true,
    user: { id: newUser.id, username: newUser.username },
    status: 201,
  };
}

async function login({ usernameOrEmail, password }) {
  const loginVal = (usernameOrEmail || '').trim();
  const pass = password || '';

  if (!loginVal) return { error: 'Username/email is required', status: 400 };
  if (!pass) return { error: 'Password is required', status: 400 };

  const isEmail = EMAIL_RE.test(loginVal);
  const user = userRepository.findByUsernameOrEmail(loginVal, isEmail);

  if (!user) {
    return { error: 'Invalid credentials', status: 401 };
  }

  const valid = await bcrypt.compare(pass, user.password_hash);
  if (!valid) {
    return { error: 'Invalid credentials', status: 401 };
  }

  return {
    success: true,
    user: sanitizeUser(user),
  };
}

module.exports = {
  register,
  login,
  sanitizeUser,
};
