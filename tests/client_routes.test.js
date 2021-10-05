const request = require('supertest');
const app = require('../app');

describe('Client Api', () => {
  it('should succesful response the create client view', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('should response 200 for client_create_get', async () => {
    const res = await request(app).get('/clients/create');
    expect(res.statusCode).toBe(200);
  });

  it('should respose 200 for clients_list', async () => {
    const res = await request(app).get('/clients/list');
    expect(res.statusCode).toBe(200);
  });

  it('should respose 200 for clients_search_get', async () => {
    const res = await request(app).get('/clients/search');
    expect(res.statusCode).toBe(200);
  });
});
