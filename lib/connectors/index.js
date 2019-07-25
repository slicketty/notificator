/**
 * List of connectors
 */

const agenda = require('./agenda')
const mongo = require('./mongo')
const mysql = require('./mysql')
const sns = require('./sns')

module.exports = { agenda, mongo, mysql, sns }
