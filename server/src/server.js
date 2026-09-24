const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');

const server = app.listen(env.port, '0.0.0.0', () => {
  console.log(`API listening on http://0.0.0.0:${env.port}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}, closing connections`);
  server.close(() => {
    pool.end(() => process.exit(0));
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
