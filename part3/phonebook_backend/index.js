const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const personsRouter = require('./controllers/person_routes');

const app = express();

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(middleware.requestLogger);

app.use('/api/persons', personsRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

mongoose.set('strictQuery', false);

const url = config.MONGODB_URI;
logger.info('connecting....');

mongoose
  .connect(url)
  .then(() => {
    logger.info('connected to MongoDB ✅');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
