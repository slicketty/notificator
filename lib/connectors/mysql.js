/**
 * MySQL connector
 */

const Sequelize = require('sequelize')
const { logger } = require('/lib/helpers')
const models = require('/lib/models/mysql')

const {
  MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_PRODUCTION_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
} = process.env

const mysql = {}

/* MySQL connection for database */
mysql[MYSQL_DATABASE] = new Sequelize(
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: MYSQL_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    logging: str => logger.info(`${MYSQL_DATABASE} db: ${str}`),
  },
)

/* MySQL connection for Production database */
mysql[MYSQL_PRODUCTION_DATABASE] = new Sequelize(
  MYSQL_PRODUCTION_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORD,
  {
    host: MYSQL_HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    logging: str => logger.info(`${MYSQL_PRODUCTION_DATABASE} db: ${str}`),
  },
)

/* Check database connection */
mysql[MYSQL_DATABASE].authenticate()
  .then(() =>
    logger.info(`MySQL ${MYSQL_DATABASE} connection established successfully`),
  )
  .catch(err => logger.error('MySQL connection error:', err))

/* Check Production database connection */
mysql[MYSQL_PRODUCTION_DATABASE].authenticate()
  .then(() =>
    logger.info(
      `MySQL ${MYSQL_PRODUCTION_DATABASE} connection established successfully`,
    ),
  )
  .catch(err => logger.error('MySQL connection error:', err))

/* Register MySQL models */
Object.keys(models).forEach(model => {
  const { db } = models[model]
  mysql[db][model] = mysql[db].define(
    models[model].name,
    models[model].schema,
    models[model].options,
  )
})

module.exports = mysql
