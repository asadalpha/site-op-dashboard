const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: env.databaseUsesSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error', error);
});

const query = (text, params) => {
  if (!env.databaseUrl) {
    const error = new Error('DATABASE_URL is not configured');
    error.statusCode = 503;
    throw error;
  }
  return pool.query(text, params);
};

module.exports = { pool, query };
