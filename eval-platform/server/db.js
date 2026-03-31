const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'eval.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS reviewers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reviewer_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    campus_name TEXT,
    role TEXT NOT NULL DEFAULT 'jury' CHECK(role IN ('jury', 'admin'))
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id TEXT UNIQUE NOT NULL,
    name TEXT,
    campus_name TEXT,
    institution_name TEXT,
    email TEXT,
    github TEXT,
    portfolio TEXT,
    linkedin TEXT,
    graduation_year TEXT,
    answers TEXT,
    video_link TEXT,
    reviewer1_id INTEGER REFERENCES reviewers(id),
    reviewer2_id INTEGER REFERENCES reviewers(id),
    reviewer3_id INTEGER REFERENCES reviewers(id),
    review1_score INTEGER,
    review1_comment TEXT,
    review2_score INTEGER,
    review2_comment TEXT,
    review3_score INTEGER,
    review3_comment TEXT,
    average_score REAL,
    conflict_flag INTEGER NOT NULL DEFAULT 0,
    needs_manual_assignment INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    reviewer_id INTEGER NOT NULL REFERENCES reviewers(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
