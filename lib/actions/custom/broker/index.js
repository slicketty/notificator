/**
 * Send push messages to multiple recipients
 */

const { isUndefined } = require('lodash')
const getSegmentRecipients = require('./getSegmentRecipients')
const getRecipients = require('./getRecipients')
const constructEnvelope = require('./constructEnvelope')
const push = require('./push')
const message = require('./message')

module.exports = (req, awsAction) =>
  new Promise(async (resolve, reject) => {
    /* Get necessary data from the query */
    const params = req.body
    const { delivery } = params
    const { recipient, client, segment, query } = params.target
    const { id, type } = params.envelope

    /* Get list of single recipient or list of recipients depending on request */
    let recipients = isUndefined(recipient)
      ? params.target.recipients
      : [recipient]

    /* Get rescipients if segmentation enabled */
    if (segment) recipients = await getSegmentRecipients({ query })

    /* Get the recipients list and return nothing on error */
    const recipientsList = await getRecipients({ recipients, client, reject })
    if (isUndefined(recipientsList)) return

    /* Construct envelope from DB data */
    const envelope = await constructEnvelope({ type, id, reject })
    if (isUndefined(envelope)) return

    /* Send push notification */
    if (delivery.includes('push'))
      await push({ recipientsList, client, envelope, awsAction, reject })

    /* Send inbox message notification */
    if (delivery.includes('message'))
      await message({ recipientsList, envelope, id, type, reject })

    /* Send both push notification and message notification */
    if (delivery.length === 0) {
      await push({ recipientsList, client, envelope, awsAction, reject })
      await message({ recipientsList, envelope, id, type, reject })
    }

    /* Resolve response data */
    resolve({
      data: params,
      message: 'accepted',
      status: 'ok',
    })
  })
