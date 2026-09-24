const fs = require('node:fs/promises');
const path = require('node:path');
const { pool } = require('../src/config/database');

const run = async () => {
  const command = process.argv[2];
  const files = command === 'migrate'
    ? (await fs.readdir(path.resolve(__dirname, '../migrations'))).filter((file) => file.endsWith('.sql')).sort()
    : ['seed.sql'];
  const folder = command === 'migrate' ? '../migrations' : '../seed';
  if (!['migrate', 'seed'].includes(command)) throw new Error('Use: npm run migrate or npm run seed');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const file of files) {
      console.log(`Running ${file}`);
      await client.query(await fs.readFile(path.resolve(__dirname, folder, file), 'utf8'));
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => { console.error(error); process.exitCode = 1; });
