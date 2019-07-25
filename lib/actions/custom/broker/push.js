/**
 * Push notification
 */

const { isUndefined, difference } = require('lodash')
const getEndpointsCached = require('./getEndpointsCached')
const getDeviceTokens = require('./getDeviceTokens')
const addPlatformEndpoint = require('./addPlatformEndpoint')
const publishNotification = require('./publishNotification')

module.exports = async ({
  recipientsList,
  client,
  envelope,
  awsAction,
  reject,
}) => {
  /* 
   * Get list of available endpoints for a given Application Platform
   * and list of all device tokens 
   */
  const endpointsObject = await getEndpointsCached({ reject })
  if (isUndefined(endpointsObject)) return
  const { endpointTokens } = endpointsObject

  /* 
   * Get list of device tokens for given recipients list,
   * flat list of device token for differentiation,
   * and recipients ids allowed to send notification.
   */
  const { deviceTokens, flatDeviceTokens, allowedRecipients } = getDeviceTokens(
    {
      recipientsList,
    },
  )

  /* Get list of tokens and devices not available as endpoints */
  const notAvailableTokens = {
    ios: difference(flatDeviceTokens.ios, endpointTokens.ios),
    android: difference(flatDeviceTokens.android, endpointTokens.android),
  }
  const notAvailableDevices = {
    ios: deviceTokens.ios.filter(device =>
      notAvailableTokens.ios.includes(device.token),
    ),
    android: deviceTokens.android.filter(device =>
      notAvailableTokens.android.includes(device.token),
    ),
  }

  /* Add not available Android devices as platform endpoints */
  for (let i = 0; i < notAvailableDevices.android.length; i += 1) {
    const device = notAvailableDevices.android[i]
    await addPlatformEndpoint({
      device,
      platform: 'android',
      awsAction,
      reject,
    })
  }

  /* Add not available iOS devices as platform endpoints */
  for (let i = 0; i < notAvailableDevices.ios.length; i += 1) {
    const device = notAvailableDevices.ios[i]
    await addPlatformEndpoint({
      device,
      platform: 'ios',
      awsAction,
      reject,
    })
  }

  /* Publish push notification */
  publishNotification({
    envelope,
    allowedRecipients,
    client,
    awsAction,
  })
}
