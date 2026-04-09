import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/utep-draw.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS drawings (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    image_b64   TEXT NOT NULL,
    top_guess   TEXT NOT NULL,
    college     TEXT,
    department  TEXT,
    explanation TEXT,
    fun_fact    TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_drawings_created_at ON drawings(created_at DESC);
`);

export function insertDrawing({ name, image_b64, top_guess, college, department, explanation, fun_fact }) {
  const stmt = db.prepare(`
    INSERT INTO drawings (name, image_b64, top_guess, college, department, explanation, fun_fact)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(name, image_b64, top_guess, college, department, explanation, fun_fact);
  return { id: result.lastInsertRowid, created_at: new Date().toISOString() };
}

export function getGallery(limit = 24, offset = 0) {
  const stmt = db.prepare(`
    SELECT id, name, image_b64, top_guess, department, created_at
    FROM drawings
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `);
  return stmt.all(limit, offset);
}

export function getDrawingById(id) {
  const stmt = db.prepare(`SELECT * FROM drawings WHERE id = ?`);
  return stmt.get(id);
}

export function getTotalCount() {
  const stmt = db.prepare(`SELECT COUNT(*) as count FROM drawings`);
  return stmt.get().count;
}

export default db;
