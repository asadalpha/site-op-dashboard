const { query } = require('../config/database');

const fields = `id, name, address, status, contact_name AS "contactName", contact_phone AS "contactPhone", created_at AS "createdAt", updated_at AS "updatedAt"`;

const findAll = async ({ search, status, page = 1, limit = 20 }) => {
  const values = [];
  const filters = [];
  if (search) { values.push(`%${search}%`); filters.push(`(name ILIKE $${values.length} OR address ILIKE $${values.length})`); }
  if (status) { values.push(status); filters.push(`status = $${values.length}`); }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * limit;
  values.push(limit, offset);
  const result = await query(`SELECT ${fields} FROM sites ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values);
  return result.rows;
};

const findById = async (id) => (await query(`SELECT ${fields} FROM sites WHERE id = $1`, [id])).rows[0] || null;

const create = async ({ name, address, status, contactName, contactPhone }) => {
  const result = await query(`INSERT INTO sites (name, address, status, contact_name, contact_phone) VALUES ($1, $2, $3, $4, $5) RETURNING ${fields}`, [name, address, status, contactName, contactPhone]);
  return result.rows[0];
};

const update = async (id, { name, address, status, contactName, contactPhone }) => {
  const result = await query(`UPDATE sites SET name = $1, address = $2, status = $3, contact_name = $4, contact_phone = $5, updated_at = NOW() WHERE id = $6 RETURNING ${fields}`, [name, address, status, contactName, contactPhone, id]);
  return result.rows[0] || null;
};

const remove = async (id) => (await query('DELETE FROM sites WHERE id = $1 RETURNING id', [id])).rowCount > 0;

module.exports = { findAll, findById, create, update, remove };
