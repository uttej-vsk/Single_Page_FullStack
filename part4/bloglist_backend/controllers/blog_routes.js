const blogRoutes = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRoutes.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1,
    });

    response.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRoutes.post('/', async (request, response, next) => {
  try {
    const { body } = request;
    const user = await User.findById(body.userId);

    if (!body.title || !body.url) {
      response
        .status(400)
        .json({ error: 'title and URL are required' });
      return;
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
});

blogRoutes.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogRoutes.patch('/:id', async (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true },
    );

    if (!updatedBlog) {
      response.status(404).json({ error: 'Blog not found' });
    }
    response.json(updatedBlog);
  } catch (error) {
    response.status(400).json({ error: 'Invalid request' });
  }
});

module.exports = blogRoutes;
