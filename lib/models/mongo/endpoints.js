/**
 * Endpoints document schema
 */

const mongo = require('mongoose')

module.exports = new mongo.Schema({
  android: [
    {
      EndpointArn: String,
      Attributes: { Enabled: Boolean, Token: String, CustomUserData: String },
    },
  ],
  ios: [
    {
      EndpointArn: String,
      Attributes: { Enabled: Boolean, Token: String, CustomUserData: String },
    },
  ],
})
