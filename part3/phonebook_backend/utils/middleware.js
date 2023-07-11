const logger = require('../utils/logger')

const requestLogger = morgan((tokens, request, response) =>
  [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'),
    '-',
    tokens['response-time'](request, response),
    'ms',
    JSON.stringify(request.body),
  ].join(' '),
);

const unknownEndPoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};


// Define error handler middleware

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    // Mongoose validation error
    const errorMessage = error.message;
    return response.status(400).send({ error: errorMessage });
  }

  return next(error);
};

module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler,
}
