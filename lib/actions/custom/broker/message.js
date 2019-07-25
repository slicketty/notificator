/*
 * Inbox message
 */

const { isUndefined } = require('lodash')
const { mongo } = require('/lib/connectors')
const { hashid } = require('/lib/helpers')
const { errors } = require('/config')

module.exports = async ({ recipientsList, envelope, id, type, reject }) =>
  recipientsList.forEach(async recipient => {
    /* Update list of notifications meta */
    const messagesMeta = recipient.messages_meta || {}
    if (isUndefined(messagesMeta[type])) {
      messagesMeta[type] = {
        updated_at: new Date(),
        total: 1,
        unviewed: 0,
      }
    } else {
      messagesMeta[type] = {
        updated_at: new Date(),
        total: messagesMeta[type].total + 1,
        unviewed: messagesMeta[type].unviewed,
      }
    }

    /* Update inbox in database */
    try {
      await mongo.phones.findByIdAndUpdate(
        recipient._id,
        {
          $push: {
            messages: {
              type,
              asset: envelope.id,
              title: envelope.title,
              body: null,
              id: hashid.encode(type, id),
              viewed_at: null,
              created_at: new Date(),
              t: Math.floor(Date.now() / 1000),
            },
          },
          $inc: { messages_total: 1 },
          messages_meta: messagesMeta,
        },
        { safe: true, upsert: true, new: true },
      )
    } catch (err) {
      return reject({
        ...errors.MONGODB_INBOX_ERROR,
        type,
        envelope,
        error: err.toString(),
      })
    }

    return true
  })
