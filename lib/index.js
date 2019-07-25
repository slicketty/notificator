/**
 * Push System HTTP server
 */

const express = require('express')
const { errors } = require('celebrate')
const { MongoClient } = require('mongodb')

const { logger, syncRecipients } = require('/lib/helpers')
const actions = require('/lib/actions')
const { AWSRoutes, CustomRoutes } = require('/config/routes')
const validations = require('/lib/validations')
const { awsAction } = require('/lib/actions/actionCreators')
const { sendPush } = require('/lib/actions/tasks')
const { agenda } = require('/lib/connectors')

logger.info('Starting Notificator')

/* Create HTTP server to accept REST calls */
const http = express()
http.use(express.json())
http.get('/', (req, res) => res.send(''))

/* Route generator based on action provided */
const route = (action, method, endpoint, validation) => {
  const activity = typeof action === 'string' ? actions[action] : action
  const activityCallback = (req, res) =>
    activity(req)
      .then(result => res.json(result))
      .catch(err => {
        logger.error(err)
        res.status(err.statusCode || 400).json(err)
      })

  if (validation) {
    http[method](endpoint, validations[action], activityCallback)
  } else {
    http[method](endpoint, activityCallback)
  }
}

/* Register Amazon SNS routes */
Object.keys(AWSRoutes).forEach(action => {
  route(action, AWSRoutes[action][0], AWSRoutes[action][1])
})

/* Register custom routes */
Object.keys(CustomRoutes).forEach(action => {
  route(
    action,
    CustomRoutes[action][0],
    CustomRoutes[action][1],
    CustomRoutes[action][2],
  )
})

/* Validation errors middleware */
http.use(errors())

/* HTTP server starter routine */
const { PORT } = process.env
const serverStarter = port =>
  http.listen(port, () => {
    logger.info(`HTTP server started successfully on port ${port}`)
  })
const server = {}

/* Redefine jobs after server restart */
const redefineJobs = () => {
  const { MONGODB_URL } = process.env
  const dbName = MONGODB_URL.split('/').slice(-1)[0]
  MongoClient.connect(
    MONGODB_URL,
    { useNewUrlParser: true },
    async (err, client) => {
      if (err) throw err

      /* Get list of current jobs */
      const db = client.db(dbName)
      const jobs = await db.collection('agendaJobs').find({})
      const jobsList = await jobs.toArray()

      /* Delete old jobs documents */
      await db.collection('agendaJobs').deleteMany({})

      /* Recreate tasks */
      jobsList.forEach(async job => {
        /* Redefine intervaled task */
        if (job.repeatInterval) {
          const jobId = job.name
          const date = job.repeatInterval
          const attrs = job.data
          sendPush(jobId, awsAction)
          await agenda.every(date, jobId, attrs)
        }

        /* Redefined scheduled task if it is not in the past */
        const data = JSON.parse(job.data.params)
        const date = new Date(data.date)
        if (date > new Date()) {
          const jobId = job.name
          const attrs = job.data
          sendPush(jobId, awsAction)
          await agenda.schedule(date, jobId, attrs)
        }
      })

      logger.info('Secretary jobs have been redefined')
    },
  )
}

/* Sync recipients list if switched on syncing and start HTTP server */
if (process.env.SYNC_RECIPIENTS === 'true') {
  syncRecipients({ awsAction })
    .then(async () => {
      logger.info('Recipients list synced')
      server.object = serverStarter(PORT)
      if (process.env.REDEFINE_JOBS === 'true') redefineJobs({ awsAction })
    })
    .catch(err => {
      logger.error(err)
    })
} else {
  logger.info('Recipients list not synced')
  server.object = serverStarter(PORT)
  if (process.env.REDEFINE_JOBS === 'true') redefineJobs({ awsAction })
}

/* Kill process on unexcepted error */
if (process.env.ENV === 'dev') {
  process.on('uncaughtException', () => {
    if (server.object) server.object.close()
  })
  process.on('SIGTERM', () => {
    if (server.object) server.object.close()
  })
}
