const { query } = require('../config/database');

const fields = `i.id, i.site_id AS "siteId", s.name AS "siteName", i.assigned_to AS "assignedTo", u.name AS "assignedToName", i.status, i.scheduled_date AS "scheduledDate", i.completed_date AS "completedDate", i.notes, i.created_at AS "createdAt"`;

const findAll = async ({ siteId, status }) => {
  const values = [];
  const filters = [];
  if (siteId) { values.push(siteId); filters.push(`i.site_id = $${values.length}`); }
  if (status) { values.push(status); filters.push(`i.status = $${values.length}`); }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  return (await query(`SELECT ${fields} FROM installations i JOIN sites s ON s.id = i.site_id LEFT JOIN users u ON u.id = i.assigned_to ${where} ORDER BY i.created_at DESC`, values)).rows;
};

const findById = async (id) => (await query(`SELECT ${fields} FROM installations i JOIN sites s ON s.id = i.site_id LEFT JOIN users u ON u.id = i.assigned_to WHERE i.id = $1`, [id])).rows[0] || null;

const create = async (data) => {
  const { siteId, assignedTo, status, scheduledDate, completedDate, notes } = data;
  const result = await query('INSERT INTO installations (site_id, assigned_to, status, scheduled_date, completed_date, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [siteId, assignedTo, status, scheduledDate, completedDate, notes]);
  return findById(result.rows[0].id);
};

const update = async (id, data) => {
  const { siteId, assignedTo, status, scheduledDate, completedDate, notes } = data;
  const result = await query('UPDATE installations SET site_id = $1, assigned_to = $2, status = $3, scheduled_date = $4, completed_date = $5, notes = $6 WHERE id = $7 RETURNING id', [siteId, assignedTo, status, scheduledDate, completedDate, notes, id]);
  return result.rows[0] ? findById(id) : null;
};

const remove = async (id) => (await query('DELETE FROM installations WHERE id = $1 RETURNING id', [id])).rowCount > 0;

module.exports = { findAll, findById, create, update, remove };
