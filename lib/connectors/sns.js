/**
 * Amazon SNS connector
 */

const { SNS } = require('aws-sdk')
const { logger } = require('/lib/helpers')

module.exports = new SNS({
  region: process.env.AWS_DEFAULT_REGION,
  logger,
})
