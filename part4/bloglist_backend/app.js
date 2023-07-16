const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const config = require('./utils/config');

const app = express();

const blogRoutes = require('./controllers/blog_routes');
const userRoutes = require('./controllers/users');
const middleware = require('./utils/middleware');
const logger = require('./utils/loggers');

mongoose.set('strictQuery', false);
logger.info('Conecting to', config.MONGODB_URL);

mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to Mongodb', error.message);
  });

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
