const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_PATH  = path.join(DATA_DIR, 'notes.db');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

db.serialize(() => {
  // Enable foreign keys
  db.run(`PRAGMA foreign_keys = ON`);

  // Folders table
  db.run(`
    CREATE TABLE IF NOT EXISTS folders (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default "Uncategorized" folder (id will be 1)
  db.run(`
    INSERT OR IGNORE INTO folders (id, name) VALUES (1, 'Uncategorized')
  `);

  // Notes table — includes folder_id and html content
  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT    NOT NULL DEFAULT 'Untitled',
      content    TEXT    NOT NULL DEFAULT '',
      color      TEXT    NOT NULL DEFAULT '#ffffff',
      pinned     INTEGER NOT NULL DEFAULT 0,
      folder_id  INTEGER NOT NULL DEFAULT 1 REFERENCES folders(id) ON DELETE SET DEFAULT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) return; // table already exists — run migration instead
    // If table already existed, try adding folder_id column (safe migration)
  });

  // Safe migration: add folder_id to existing notes table if missing
  db.run(`ALTER TABLE notes ADD COLUMN folder_id INTEGER NOT NULL DEFAULT 1 REFERENCES folders(id) ON DELETE SET DEFAULT`,
    () => { /* ignore error if column already exists */ }
  );
});

module.exports = db;
