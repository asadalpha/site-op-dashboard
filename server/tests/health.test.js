const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

test('GET /api/health returns service status', async () => {
  const response = await request(app).get('/api/health');
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.status, 'ok');
});

test('unknown routes return a JSON 404', async () => {
  const response = await request(app).get('/api/does-not-exist');
  assert.equal(response.statusCode, 404);
  assert.match(response.body.error, /Route not found/);
});
