const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "program",
  password: process.env.DB_PASSWORD || "test",
  database: process.env.DB_NAME || "persons",
});

async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS persons (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      age INTEGER,
      address VARCHAR(255),
      work VARCHAR(255)
    )
  `);
}

module.exports = { pool, ensureSchema };
