/**
 * Get list of available endpoints for a given Application Platform from MongoDB cache
 */

const { isUndefined } = require('lodash')
const { mongo } = require('/lib/connectors')
const { errors } = require('/config')

module.exports = async ({ reject }) => {
  const endpoints = {}

  /* Get list of endpoints from cache document in MongoDB */
  try {
    const response = await mongo.endpoints.find({})
    const [all] = [...response]
    endpoints.all = all
  } catch (err) {
    return reject({
      ...errors.MONGODB_ENDPOINTS_ERROR,
      error: err.toString(),
    })
  }

  /* Endpoints document is absent */
  if (isUndefined(endpoints.all)) {
    return reject({
      ...errors.MONGODB_ENDPOINTS_ERROR,
    })
  }

  /* Get flat array of endpoint tokens for Android and iOS */
  endpoints.tokens = {
    android: endpoints.all.android.map(e => e.Attributes.Token),
    ios: endpoints.all.ios.map(e => e.Attributes.Token),
  }

  return { endpoints: endpoints.all, endpointTokens: endpoints.tokens }
}
