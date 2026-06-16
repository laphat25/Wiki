// ============================================
// middleware/auth.js — Auth middleware
// ============================================

function requireLogin(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

function requireEditor(req, res, next) {
  const role = req.session?.user?.role ?? 'user';
  if (!['editor', 'admin'].includes(role)) {
    return res.status(403).json({ error: 'Editor or admin role required' });
  }
  next();
}

function requireAdmin(req, res, next) {
  const role = req.session?.user?.role ?? 'user';
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Admin role required' });
  }
  next();
}

module.exports = { requireLogin, requireEditor, requireAdmin };
