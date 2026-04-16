import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize schema on first connection
export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drawings (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      image_b64   TEXT NOT NULL,
      top_guess   TEXT NOT NULL,
      college     TEXT,
      department  TEXT,
      explanation TEXT,
      fun_fact    TEXT,
      created_at  TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_drawings_created_at ON drawings(created_at DESC);
  `);
  console.log('[DB] PostgreSQL connected, schema ready');
}

export async function insertDrawing({ name, image_b64, top_guess, college, department, explanation, fun_fact }) {
  const result = await pool.query(
    `INSERT INTO drawings (name, image_b64, top_guess, college, department, explanation, fun_fact)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, created_at`,
    [name, image_b64, top_guess, college, department, explanation, fun_fact]
  );
  return result.rows[0];
}

export async function getGallery(limit = 24, offset = 0) {
  const result = await pool.query(
    `SELECT id, name, image_b64, top_guess, department, created_at
     FROM drawings
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return result.rows;
}

export async function getDrawingById(id) {
  const result = await pool.query(
    `SELECT * FROM drawings WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function getTotalCount() {
  const result = await pool.query(`SELECT COUNT(*)::int as count FROM drawings`);
  return result.rows[0].count;
}

export default pool;
