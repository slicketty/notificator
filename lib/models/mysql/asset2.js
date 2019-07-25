/**
 * Asset #2 model
 */

const Sequelize = require('sequelize')

module.exports = {
  db: process.env.MYSQL_DATABASE,
  name: 'asset2',
  schema: {
    id: { type: Sequelize.STRING, primaryKey: true },
    title: { type: Sequelize.STRING },
  },
  options: {
    timestamps: false,
  },
}
