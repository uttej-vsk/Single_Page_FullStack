const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const logger = require('../utils/loggers');

const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe('Initially when some blogs are saved', () => {
  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 10000);

  test('Checks blogs count as length', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  }, 10000);

  test('verifies that property inside of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  }, 10000);
});

test('verifies POST api successfully creates a new blog post', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'John Doe',
    url: 'https://example.com',
    likes: 5,
  };

  const initialResponse = await api.get('/api/blogs');
  const initialBlogs = initialResponse.body;

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const updatedResponse = await api.get('/api/blogs');
  const updatedBlogs = updatedResponse.body;

  expect(updatedBlogs.length).toBe(initialBlogs.length + 1);

  const addedBlog = updatedBlogs.find(
    (blog) => blog.title === newBlog.title,
  );
  expect(addedBlog).toBeDefined();
  expect(addedBlog.author).toBe(newBlog.author);
  expect(addedBlog.url).toBe(newBlog.url);
  expect(addedBlog.likes).toBe(newBlog.likes);
}, 10000);

test('Verifies likes property is defined in the existing data', async () => {
  const response = await api.get('/api/blogs');
  const blogIdExist = response.body;
  const findLikes = blogIdExist.map((obj) => obj.likes);
  expect(findLikes).toBeDefined();
}, 10000);

test('verify default likes value when property is missing', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Uttej',
    url: 'https://uttej.com',
  };

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201);
  expect(response.body).toHaveProperty('likes', 0);
}, 10000);

test('returns 400 Bad Request if title is missing', async () => {
  const newBlog = {
    author: 'Uttej',
    url: 'https://uttej.com',
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
}, 10000);

test('returns 400 Bad Request if url is missing', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Uttej',
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
}, 10000);

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const title = blogsAtEnd.map((r) => r.title);

    expect(title).not.toContain(blogToDelete.title);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
