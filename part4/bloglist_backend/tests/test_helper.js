const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'First Blog',
    author: 'John Doe',
    url: 'https://example.com/first-blog',
    likes: 10,
  },
  {
    title: 'Second Blog',
    author: 'Jane Smith',
    url: 'https://example.com/second-blog',
    likes: 5,
  },
  {
    title: 'Third Blog',
    author: 'Alice Johnson',
    url: 'https://example.com/third-blog',
    likes: 2,
  },
];

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    passwordHash: bcrypt.hashSync('root', 10),
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    url: 'https://example.com',
    likes: 0,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const validUser = {
  username: 'root',
  name: 'Superuser',
  password: 'root',
};

const generateTokenForUser = (user) => {
  const userForToken = {
    id: user.id,
    username: user.username,
  };

  return jwt.sign(userForToken, process.env.JWT_SECRET);
};

const validToken = async () => {
  const user = await User.findOne({ username: validUser.username });
  return generateTokenForUser(user);
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  validToken,
  generateTokenForUser,
};
