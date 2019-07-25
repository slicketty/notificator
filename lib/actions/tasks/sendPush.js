/**
 * Push notification scheduler
 */

const { agenda } = require('/lib/connectors')
const broker = require('/lib/actions/custom/broker')

module.exports = (id, awsAction) =>
  agenda.define(id, async job => {
    /* Deserialize params */
    const deserializedParams = JSON.parse(job.attrs.data.params)

    /* Payload extraction */
    const { payload } = deserializedParams
    const req = { body: payload }

    /* Invoke broker */
    await broker(req, awsAction)
  })
