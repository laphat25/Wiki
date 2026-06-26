// ============================================
// src/server.js — Application entry point
// ============================================

const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');

const config = require('./config');
const logger = require('./utils/logger');
const requestIdMiddleware = require('./middleware/requestId');
const { runMigrations } = require('./db/migrate');

const moviesRouter = require('./routes/movies');
const authRouter = require('./routes/auth');
const updateMovieRouter = require('./routes/updateMovie');
const commentsRouter = require('./routes/comments');
const uploadRouter = require('./routes/upload');
const healthRouter = require('./routes/health');
const feedbackRouter = require('./routes/feedback');
const adminRouter = require('./routes/admin');
const db = require('./db/connection');

// Auto-run migrations on startup
runMigrations();

const app = express();
app.set('trust proxy', 1);

// ============================================
// Security & logging
// ============================================
app.use(helmet({
  contentSecurityPolicy: false, // frontend uses inline styles/scripts
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(requestIdMiddleware);
app.use(pinoHttp({
  logger,
  genReqId: (req) => req.id,
}));

// ============================================
// CORS
// ============================================
const corsOptions = {
  credentials: config.cors.credentials,
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (config.cors.origins === '*') {
      return callback(null, true);
    }

    if (config.cors.origins.includes(origin)) {
      return callback(null, true);
    }

    if (!config.isProduction) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
};
app.use(cors(corsOptions));

// ============================================
// Body parsers
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Session store (SQLite-backed)
// ============================================
const sessionDir = path.dirname(config.session.storePath);
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

app.use(session({
  store: new SQLiteStore({ db: path.basename(config.session.storePath), dir: sessionDir }),
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  name: 'connect.sid',
  cookie: config.session.cookie,
}));

// ============================================
// View count tracking middleware
// ============================================
app.use((req, res, next) => {
  if (req.method === 'GET') {
    const urlPath = req.path;
    const isHtmlPage = urlPath === '/' || urlPath.endsWith('.html');
    const isAsset = urlPath.includes('.') && !urlPath.endsWith('.html');

    if (isHtmlPage && !isAsset) {
      try {
        db.query("UPDATE site_stats SET value = value + 1 WHERE key = 'total_views'");
      } catch (err) {
        req.log?.error(err, 'Failed to update total_views count');
      }
    }
  }
  next();
});

// ============================================
// Static files
// ============================================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const frontendPath = process.env.FRONTEND_PATH
  || path.join(__dirname, '../../frontend');

// Trả về JSON thông báo API nếu truy cập qua domain backend trên Cloudflare
app.use((req, res, next) => {
  if (req.hostname === 'backend_wiki.domlp.io.vn' && req.path === '/') {
    return res.json({ name: "Doraemon Wiki API", status: "running", version: "2.0.0" });
  }
  next();
});

app.use('/', express.static(frontendPath));

// ============================================
// API routes
// ============================================
app.use('/api/movies', moviesRouter);
app.use('/api/movies', updateMovieRouter);
app.use('/api/auth', authRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/health', healthRouter);
app.use('/api/feedbacks', feedbackRouter);
app.use('/api/admin', adminRouter);

app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// ============================================
// Start server (skip when required by tests)
// ============================================
if (require.main === module) {
  app.listen(config.port, () => {
    logger.info({
      port: config.port,
      env: config.env,
      db: config.db.path,
    }, 'Doraemon Wiki API started');

    console.log(`\n🚀 Doraemon Wiki API running at http://localhost:${config.port}`);
    console.log(`   Frontend:  http://localhost:${config.port}/`);
    console.log(`   API Base:  http://localhost:${config.port}/api`);
    console.log(`   Health:    http://localhost:${config.port}/api/health\n`);
  });
}

module.exports = app;
