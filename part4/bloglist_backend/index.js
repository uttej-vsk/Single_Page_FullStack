const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

const logger = require('./utils/loggers')
const config = require('./utils/config')
const blogRoutes = require('./controllers/blog_routes')

mongoose.connect(config.MONGODB_URL)
logger.info("Conecting....")
logger.info("Connected to MongoDB")

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogRoutes)

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`)
})

module.exports = app