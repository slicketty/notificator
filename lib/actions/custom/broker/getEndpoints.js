/**
 * Get list of available endpoints for a given Application Platform
 */

const { isUndefined } = require('lodash')

const listEndpointByPlatform = async ({ awsAction, platform }) => {
  /* Get PlatformApplicationArn string */
  const PlatformApplicationArn =
    platform === 'android'
      ? process.env.AWS_ANDROID_APPLICATION_ARN
      : process.env.AWS_IOS_APPLICATION_ARN

  /* Get first up to 100 endpoints for a given platform */
  const list = await awsAction('listEndpointsByPlatformApplication')({
    body: {
      PlatformApplicationArn,
    },
  })

  /**
   * AWS SNS allows up to 100 endpoints for single request.
   * Use NextToken to get new portion.
   */
  while (!isUndefined(list.NextToken)) {
    const nextPortion = await awsAction('listEndpointsByPlatformApplication')({
      body: {
        PlatformApplicationArn,
        NextToken: list.NextToken,
      },
    })
    list.Endpoints.push(...nextPortion.Endpoints)
    list.NextToken = nextPortion.NextToken
  }

  return list
}

module.exports = async ({ awsAction }) => {
  const endpoints = {}

  /* Get list of endpoints for Android and iOS platfroms */
  try {
    endpoints.android = await listEndpointByPlatform({
      awsAction,
      platform: 'android',
    })

    endpoints.ios = await listEndpointByPlatform({
      awsAction,
      platform: 'ios',
    })
  } catch (err) {
    throw err
  }

  /* Get flat array of endpoint tokens for Android and iOS */
  const endpointTokens = {
    android: endpoints.android.Endpoints.map(e => e.Attributes.Token),
    ios: endpoints.ios.Endpoints.map(e => e.Attributes.Token),
  }

  return { endpoints, endpointTokens }
}
