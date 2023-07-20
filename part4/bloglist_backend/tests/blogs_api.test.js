const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

beforeEach(async () => {
  // Clear the database
  await Blog.deleteMany({});
  await User.deleteMany({});

  // Create initial users
  const passwordHash = await bcrypt.hash('password', 10);
  const userObjects = helper.initialUsers.map((user, index) => ({
    ...user,
    passwordHash,
  }));
  const userPromises = userObjects.map((user) =>
    new User(user).save(),
  );
  await Promise.all(userPromises);

  // Create initial blogs
  const user = await User.findOne({ username: 'root' });
  const blogsWithUser = helper.initialBlogs.map((blog) => ({
    ...blog,
    user: user._id,
  }));
  const blogPromises = blogsWithUser.map((blog) =>
    new Blog(blog).save(),
  );
  await Promise.all(blogPromises);
});

describe('when there is initially some saved blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('checks blogs count as length', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('verifies that property inside of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const response = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toEqual(blogToView);
  });

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId();

    await api.get(`/api/blogs/${validNonExistingId}`).expect(404);
  });

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '12345';
    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${await helper.validToken()}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain(newBlog.title);
  });

  test('fails with status code 401 if token is missing', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 10,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);
  });

  test('fails with status code 400 if data is invalid', async () => {
    const newBlog = {
      author: 'Test Author',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${await helper.validToken()}`)
      .send(newBlog)
      .expect(400);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${await helper.validToken()}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('fails with status code 401 if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
  });

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '12345';
    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `bearer ${await helper.validToken()}`)
      .expect(400);
  });
});

describe('updating a blog', () => {
  test('succeeds with valid data', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    };

    const response = await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(blogToUpdate.likes + 1);
  });

  test('fails with status code 400 if id is invalid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    };

    const invalidId = '12345';

    await api
      .patch(`/api/blogs/${invalidId}`)
      .send(updatedBlog)
      .set('Authorization', `bearer ${await helper.validToken()}`)
      .expect(400);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
