-- Migration 005: Create site_stats table for tracking total page views
CREATE TABLE IF NOT EXISTS site_stats (
  key   TEXT PRIMARY KEY,
  value INTEGER DEFAULT 0
);

INSERT OR IGNORE INTO site_stats (key, value) VALUES ('total_views', 0);
