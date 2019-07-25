/**
 * Get recipients id list for a given segment
 */

const { mongo } = require('/lib/connectors')

module.exports = async ({ query }) => {
  const segmentRecipients = await mongo.phones.find(query)
  return segmentRecipients.map(recipient => recipient.id)
}
