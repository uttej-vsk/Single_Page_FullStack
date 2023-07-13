const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const logger = require('../utils/loggers');

test('Blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('there are two notes', async () => {
  const response = await api.get('/api/blogs');
  logger.info(response.body);
  expect(response.body).toHaveLength(2);
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
});
