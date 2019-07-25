/**
 * Phones document schema
 */

const mongo = require('mongoose')

module.exports = new mongo.Schema({
  _id: mongo.Schema.ObjectId,
  id: String,
  client_id: Number,
  notify_status: Boolean,
  messages: [
    {
      _id: false,
      type: { type: String },
      asset: String,
      title: String,
      body: String,
      id: String,
      viewed_at: Date,
      created_at: Date,
      t: Number,
    },
  ],
  messages_meta: mongo.Schema.Types.Mixed,
  devices: [
    {
      id: String,
      token: String,
      notifications: Boolean,
      os: String,
    },
  ],
  messages_total: Number,
})
