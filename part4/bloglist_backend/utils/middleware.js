const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('./loggers');

const tokenExtractor = async (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('bearer ')) {
    const token = authorization.replace('bearer ', '');
    request.token = token; // Set the token on the request object
    next(); // Call the next middleware
  } else {
    response.status(401).json({ error: 'Unauthorized access' });
  }
};

const userExtractor = async (request, response, next) => {
  try {
    const { token } = request;
    if (!token) {
      return response.status(401).json({ error: 'Token missing' });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.JWT_SECRET,
    );
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Invalid token' });
    }

    const userId = decodedToken.id.toString();
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    request.user = user;
    next();
  } catch (error) {
    logger.error('Error extracting user from token:', error.message);
    return response.status(401).json({ error: 'Invalid token' });
  }
};

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'unknown endpoint' });
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token',
    });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }
  return next(error);
};

module.exports = {
  userExtractor,
  tokenExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
