/**
 * Construct envelope for sending
 */

const { mysql } = require('/lib/connectors')
const models = require('/lib/models/mysql')
const { errors } = require('/config')

module.exports = async ({ type, id, reject }) => {
  /* Determine db name where envelope data residue */
  const { db } = models[type]

  /* Get actual data to deliver */
  const envelope = {}
  try {
    envelope.object = await mysql[db][type].findById(id)
  } catch (err) {
    return reject({
      ...errors.MYSQL_ENVELOPE_ERROR,
      id,
      type,
      error: err.toString(),
    })
  }

  /* Construct envelope from DB data and return */
  return {
    id: envelope.object.id.toString(),
    title: envelope.object.title || envelope.object.title1,
  }
}
