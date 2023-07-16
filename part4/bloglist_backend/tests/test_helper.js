const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'start with why',
    author: 'Simon Sinek',
    url: 'www.startwithwhy.com',
    likes: 100,
  },
  {
    title: 'The One Thing',
    author: 'Gary Keller',
    url: 'www.theonething.com',
    likes: 100,
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'lorpe sidem',
    author: 'lorpe sidem11',
    url: 'www.lorpesidem.com',
    likes: 200,
    user: 'sjhsjhs',
  });
  await Blog.save();
  await Blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
