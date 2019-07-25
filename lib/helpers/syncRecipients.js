/**
 * Sync recipients list between AWS and MongoDB cache document
 */

const { MongoClient } = require('mongodb')
const getEndpoints = require('/lib/actions/custom/broker/getEndpoints')

module.exports = async ({ awsAction }) => {
  /* Get recipients list */
  const { endpoints } = await getEndpoints({ awsAction })

  /* Update MongoDB recipients cache */
  MongoClient.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) throw err
      const db = client.db('logs')
      const collection = db.collection('endpoints')

      collection.updateMany(
        {},
        {
          $set: {
            android: endpoints.android.Endpoints,
            ios: endpoints.ios.Endpoints,
          },
        },
        { upsert: true },
      )
    },
  )
}
