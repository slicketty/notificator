/**
 * Delete scheduled events
 */

const { agenda } = require('/lib/connectors')

module.exports = req =>
  new Promise(async resolve => {
    /* Get necessary data from the query */
    const { params } = req
    const response = params

    /* Cancel job */
    const jobs = await agenda.cancel({ name: params.id })

    /* Add necessary response fields */
    response.status = jobs === 1 ? 'ok' : 'job not found'

    /* Response to REST call */
    return resolve(response)
  })
