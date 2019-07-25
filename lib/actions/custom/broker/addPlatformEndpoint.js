/**
 * Add platfrom endpoint
 */

const { mongo } = require('/lib/connectors')
const { errors } = require('/config')

module.exports = async ({ device, platform, awsAction, reject }) => {
  /* Create filter policy and use it as endpoint custom user data */
  const FilterPolicy = JSON.stringify({
    id: [device.id],
    client: [device.client],
  })

  /* New Platfrom Endpoint params */
  const params = {
    Token: device.token,
    CustomUserData: FilterPolicy,
  }

  /* Choose Platform Endpoint ARN depending on Device OS */
  switch (platform) {
    case 'android':
      params.PlatformApplicationArn = process.env.AWS_ANDROID_APPLICATION_ARN
      break
    case 'ios':
      params.PlatformApplicationArn = process.env.AWS_IOS_APPLICATION_ARN
      break
    default:
      return reject({
        ...errors.MONGODB_ADD_ENDPOINT_ERROR,
      })
  }

  /* Create platfrom endpoint */
  const endpoint = {}
  try {
    endpoint.object = await awsAction('createPlatformEndpoint')({
      body: params,
    })
  } catch (err) {
    return reject({
      ...errors.AWS_ADD_ENDPOINT_ERROR,
      error: err.toString(),
    })
  }

  /* Subscribe new platfrom to push topic */
  await awsAction('subscribe')({
    body: {
      Protocol: 'application',
      TopicArn: process.env.AWS_PUSH_TOPIC_ARN,
      Endpoint: endpoint.object.EndpointArn,
      Attributes: { FilterPolicy },
    },
  })

  /* Update list of endpoints locally */
  try {
    const endpointsDocument = await mongo.endpoints.findOne({})
    const endpointToAdd = {}
    endpointToAdd[platform] = {
      EndpointArn: endpoint.object.EndpointArn,
      Attributes: {
        Enabled: true,
        Token: device.token,
        CustomUserData: FilterPolicy,
      },
    }

    await mongo.endpoints.findByIdAndUpdate(
      endpointsDocument._id,
      { $push: endpointToAdd },
      { safe: true, upsert: true, new: true },
    )
  } catch (err) {
    return reject({
      ...errors.MONGODB_ADD_ENDPOINT_ERROR,
      error: err.toString(),
    })
  }

  return true
}
