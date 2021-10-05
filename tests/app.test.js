const request = require('supertest');
const app = require('../app');

describe('Test the root path using promises', () => {
  test('It should response the GET method', () => request(app)
    .get('/')
    .then((response) => {
      expect(response.statusCode).toBe(200);
    }));
});

describe('Test the root path', () => {
  test('It should response the GET method using async', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test the healthcheck', () => {
  test('It should response the GET method using async', async () => {
    const response = await request(app).get('/healthcheck');
    expect(response.statusCode).toBe(200);
  });
});
