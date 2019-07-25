/**
 * Get the recipients list filtered by notification availability
 */

const { mongo } = require('/lib/connectors')
const { errors } = require('/config')

module.exports = async ({ recipients, client, reject }) => {
  const recipientsList = {}

  try {
    recipientsList.all = await mongo.phones.find({
      id: { $in: recipients },
      client_id: client,
    })
  } catch (err) {
    return reject({
      ...errors.MONGODB_RECIPIENT_ERROR,
      recipients,
      client,
      error: err.toString(),
    })
  }

  /* Return an error if recipients not found */
  if (recipientsList.all.length === 0) {
    return reject({
      ...errors.RECIPIENTS_NOT_FOUND_ERROR,
      recipients,
      client,
    })
  }

  /* Check on notification acceptance status and filter by it */
  recipientsList.available = recipientsList.all.filter(
    recipient => recipient.notify_status,
  )

  /* Return an error if all recipients not allow to send notification */
  if (recipientsList.available.length === 0) {
    return reject({
      ...errors.NOTIFICATIONS_NOT_ALLOWED_ERROR,
      recipients,
      client,
    })
  }

  return recipientsList.available
}
