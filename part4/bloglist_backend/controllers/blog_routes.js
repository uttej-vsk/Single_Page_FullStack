const blogRoutes = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const { tokenExtractor } = require('../utils/middleware');

blogRoutes.get(
  '/',
  tokenExtractor,
  async (request, response, next) => {
    try {
      const blogs = await Blog.find({}).populate('user', {
        username: 1,
        name: 1,
      });

      response.status(200).json(blogs);
    } catch (error) {
      next(error);
    }
  },
);

blogRoutes.post(
  '/',
  tokenExtractor,
  async (request, response, next) => {
    try {
      const { body, token } = request;

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
        expiresIn: 60 * 60,
      });
      if (!decodedToken.id) {
        response.status(401).json({ error: 'invalid credentials' });
      }
      console.log(decodedToken);

      const user = await User.findById(decodedToken.id);

      if (!body.title || !body.url) {
        response
          .status(400)
          .json({ error: 'title and URL are required' });
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
      return response.status(201).json(savedBlog);
    } catch (error) {
      return next(error);
    }
  },
);

blogRoutes.delete(
  '/:id',
  tokenExtractor,
  async (request, response) => {
    try {
      const blogToBeDeleted = await Blog.findById(
        request.params.id,
      ).exec();
      const { token } = request;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (
        decodedToken.id.toString() ===
        blogToBeDeleted.user[0].toString()
      ) {
        await Blog.findByIdAndRemove(request.params.id);
        response.status(204).end();
      } else {
        response.status(400).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: 'Internal server error' });
    }
  },
);

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
