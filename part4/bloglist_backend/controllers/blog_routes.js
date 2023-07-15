const blogRoutes = require('express').Router();
const Blog = require('../models/blog');

blogRoutes.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.status(200).json(blogs);
  } catch (error) {
    next(error);
  }
});

blogRoutes.post('/', async (request, response, next) => {
  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    response
      .status(400)
      .json({ error: 'title and URL are required' });
    return;
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
  });

  try {
    const savedBlog = await blog.save();
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
