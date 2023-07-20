const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const logger = require('../utils/loggers');
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  logger.info('User Found:', user);

  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(password, user.password);

  if (!(user && passwordCorrect)) {
    return response
      .status(401)
      .json({ error: 'Invalid credentials' });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
    expiresIn: 60 * 60,
  });

  return response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
