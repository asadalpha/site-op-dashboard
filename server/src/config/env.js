const path = require('node:path');
const dotenv = require('dotenv');

const requestedNodeEnv = process.env.NODE_ENV || 'development';
const environmentFile = requestedNodeEnv === 'production' ? '.env.production' : '.env';

// Development reads server/.env (local PostgreSQL). Production reads
// server/.env.production when present, while hosted environments use their
// injected variables. Existing process variables always take precedence.
dotenv.config({ path: path.resolve(__dirname, `../../${environmentFile}`) });

const env = {
  nodeEnv: process.env.NODE_ENV || requestedNodeEnv,
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL,
};

let databaseHost = '';
if (env.databaseUrl) {
  try {
    databaseHost = new URL(env.databaseUrl).hostname;
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL');
  }
}

env.databaseHost = databaseHost;
env.databaseUsesSsl = databaseHost.endsWith('.neon.tech') || env.nodeEnv === 'production';

module.exports = env;
