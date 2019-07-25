/**
 * Action creation helper
 */

const { sns } = require('/lib/connectors')
const custom = require('./custom')

/* Amazon SNS action */
const awsAction = method => params =>
  new Promise((resolve, reject) =>
    sns[method](
      params.body,
      (err, data) => (err ? reject(err) : resolve(data)),
    ),
  )

/* Custom action */
const customAction = method => params => custom[method](params, awsAction)

module.exports = { awsAction, customAction }
