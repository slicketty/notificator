/**
 * Asset #3 model
 */

const Sequelize = require('sequelize')

module.exports = {
  db: process.env.MYSQL_PRODUCTION_DATABASE,
  name: 'asset3',
  schema: {
    id: { type: Sequelize.STRING, primaryKey: true },
    title1: { type: Sequelize.STRING },
    title2: { type: Sequelize.STRING },
  },
  options: {
    timestamps: false,
  },
}
