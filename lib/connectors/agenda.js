/**
 * Agenda connector for storing scheduling data in MongoDB
 */

const Agenda = require('agenda')

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URL,
    options: { useNewUrlParser: true },
  },
})

agenda.start()

module.exports = agenda
