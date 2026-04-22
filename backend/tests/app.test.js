const request = require('supertest');
const app = require('../index');

test('GET /health retourne OK', async () => {
  const res = await request(app).get('/health');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('OK');
});

test('GET /api/todos retourne une liste', async () => {
  const res = await request(app).get('/api/todos');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});