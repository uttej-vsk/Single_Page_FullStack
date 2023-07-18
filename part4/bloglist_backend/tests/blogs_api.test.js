const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const helper = require('./test_helper');
const logger = require('../utils/loggers');
const User = require('../models/user');

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

  const request = await api
    .patch('/api/blogs')
    .send(newBlog)
    .expect(201);
  expect(request.body).toHaveProperty('likes', 0);
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

  test('Verifies to check if the likes is updated in the blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToBeUpdated = blogsAtStart[0];

    const blogUpdate = {
      likes: 200,
    };

    await api
      .patch(`/api/blogs/${blogToBeUpdated.id}`)
      .send(blogUpdate)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlogInDb = blogsAtEnd.find(
      (blog) => blog.id === blogToBeUpdated.id,
    );
    expect(updatedBlogInDb.likes).toBe(blogUpdate.likes);
  });
});

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('root', 10);
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    });

    await user.save();
  });

  test('creation succeeded with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'uttej',
      name: 'Uttej V S K',
      password: 'uttejvsk',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((user) => user.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper status code and error message if username exists', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'uttejroot',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    console.log(result.body);
    expect(result.body.error).toMatch(
      'expected `username` to be unique',
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
