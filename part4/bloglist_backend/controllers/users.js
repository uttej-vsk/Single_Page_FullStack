const bcrypt = require('bcrypt');
const userRoutes = require('express').Router();
const User = require('../models/user');

userRoutes.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    likes: 1,
  });

  response.json(users);
});

userRoutes.post('/', async (request, response, next) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response
      .status(401)
      .json({ error: 'password must be at least 3 characters' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    password: passwordHash,
  });

  try {
    const savedUser = await user.save();
    return response.status(201).json(savedUser);
  } catch (error) {
    return next(error);
  }
});

module.exports = userRoutes;
