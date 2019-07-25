/**
 * Get list of device tokens for given recipients list
 */

const { uniq } = require('lodash')

module.exports = ({ recipientsList }) => {
  /* Divide between Android and iOS for convenience */
  const deviceTokens = { android: [], ios: [] }

  /* Device data pusher */
  const deviceDataPusher = ({ recipient, device, platform }) =>
    deviceTokens[platform].push({
      id: recipient.id,
      client: recipient.client_id,
      token: device.token,
    })

  recipientsList.forEach(recipient => {
    const recipientDevices = recipient.devices

    /* Skip recipient on empty device list */
    if (recipientDevices.length > 0)
      recipientDevices.forEach(device => {
        /* Skip device if notification not allowed */
        if (device.notifications)
          deviceDataPusher({ recipient, device, platform: device.os })
      })
  })

  /* Uniq array of recipients ids allowed to send notifications */
  const allowedRecipients = uniq(
    [...deviceTokens.android, ...deviceTokens.ios].map(
      deviceToken => deviceToken.id,
    ),
  )

  /* Flat arrays of device tokens for Android and iOS */
  const flatDeviceTokens = {
    android: deviceTokens.android.map(d => d.token),
    ios: deviceTokens.ios.map(d => d.token),
  }

  return { deviceTokens, flatDeviceTokens, allowedRecipients }
}
