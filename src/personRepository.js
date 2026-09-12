const { pool } = require("./db");

function toPerson(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    age: row.age === null ? undefined : row.age,
    address: row.address === null ? undefined : row.address,
    work: row.work === null ? undefined : row.work,
  };
}

async function list() {
  const { rows } = await pool.query("SELECT * FROM persons ORDER BY id");
  return rows.map(toPerson);
}

async function get(id) {
  const { rows } = await pool.query("SELECT * FROM persons WHERE id = $1", [id]);
  return toPerson(rows[0]);
}

async function create({ name, age, address, work }) {
  const { rows } = await pool.query(
    "INSERT INTO persons (name, age, address, work) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, age ?? null, address ?? null, work ?? null]
  );
  return toPerson(rows[0]);
}

async function update(id, patch) {
  const existing = await get(id);
  if (!existing) return null;

  const merged = { ...existing, ...patch };
  const { rows } = await pool.query(
    "UPDATE persons SET name = $1, age = $2, address = $3, work = $4 WHERE id = $5 RETURNING *",
    [merged.name, merged.age ?? null, merged.address ?? null, merged.work ?? null, id]
  );
  return toPerson(rows[0]);
}

async function remove(id) {
  const { rowCount } = await pool.query("DELETE FROM persons WHERE id = $1", [id]);
  return rowCount > 0;
}

module.exports = { list, get, create, update, remove };
