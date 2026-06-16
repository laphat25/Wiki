-- Migration 001: Initial schema (SQLite)

CREATE TABLE IF NOT EXISTS movies (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  title_vi       TEXT NOT NULL,
  title_jp       TEXT,
  release_year   INTEGER NOT NULL,
  release_date   TEXT,
  director       TEXT,
  plot           TEXT,
  image_url      TEXT DEFAULT NULL,
  trailer_url    TEXT DEFAULT NULL,
  wiki_url       TEXT DEFAULT NULL,
  streaming_url  TEXT DEFAULT NULL,
  box_office     TEXT,
  theme_song     TEXT,
  is_featured    INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  email         TEXT NOT NULL UNIQUE,
  role          TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS comments (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  movie_id   INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
