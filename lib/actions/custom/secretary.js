/**
 * Scheduled events secretary
 */

const mongo = require('mongoose')
const { agenda } = require('/lib/connectors')
const { sendPush } = require('/lib/actions/tasks')

module.exports = (req, awsAction) =>
  new Promise(async (resolve, reject) => {
    /* Get necessary data from the query */
    const params = req.body

    /* 
     * Serialize query since it is not allowed 
     * to start fields in MongoDB from special characters 
     */
    const serializedParams = JSON.stringify(params)

    /* Response object */
    const response = {
      verb: 'PUT',
      message: 'accepted',
      status: 'OK',
    }

    /* Generate job id */
    const generateJobId = () => mongo.Types.ObjectId().toString()

    /* Construct data response string */
    const constructDataString = () =>
      `put ${params.type} ${params.payload.delivery.toString()} (${
        params.date
      }) ${JSON.stringify(params.payload)}`

    /* Start tasks depending on type of job */
    try {
      if (params.type === 'intervaled') {
        const jobId = generateJobId()
        const { date } = params
        const attrs = { params: serializedParams }
        sendPush(jobId, awsAction)
        await agenda.every(date, jobId, attrs)
        response.id = jobId
        response.data = constructDataString()
      } else {
        const jobId = generateJobId()
        const date = new Date(params.date)
        const attrs = { params: serializedParams }
        sendPush(jobId, awsAction)
        await agenda.schedule(date, jobId, attrs)
        response.id = jobId
        response.data = constructDataString()
      }
    } catch (err) {
      reject(err)
    }

    /* Return REST response */
    return resolve(response)
  })
