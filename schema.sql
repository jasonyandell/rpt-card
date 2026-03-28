-- D1 migration for rpt-card
-- Run via: wrangler d1 execute rpt-card-db --file=schema.sql

CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity TEXT NOT NULL,
  date TEXT NOT NULL,  -- YYYY-MM-DD
  value REAL,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(activity, date)
);

CREATE INDEX IF NOT EXISTS idx_entries_date ON entries(date);
CREATE INDEX IF NOT EXISTS idx_entries_activity ON entries(activity);
