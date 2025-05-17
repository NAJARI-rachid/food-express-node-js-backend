const request = require('supertest');
const app = require('../server');

describe('User Register', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/users/register').send({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    });


    expect(res.statusCode).toEqual(201);
  });
});

