/**
 * MongoDB connector
 */

const mongo = require('mongoose')
const { logger } = require('/lib/helpers')
const schemas = require('/lib/models/mongo')

mongo.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true },
)

mongo.connection.once('connected', () =>
  logger.info('MongoDB connection established successfully'),
)

mongo.connection.on('error', error =>
  logger.error('MongoDB connection error: ', error),
)

/* Register Mongo models */
Object.keys(schemas).forEach(schema => {
  mongo[schema] = mongo.model(schema, schemas[schema])
})

module.exports = mongo
