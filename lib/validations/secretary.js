/**
 * Secretary validation
 */

const { celebrate, Joi } = require('celebrate')
const { target, delivery, envelope } = require('./broker')

// const CronRx = /^(([0-9-]{1,2}|\*)\s?){5}/

module.exports = {
  secretary: celebrate({
    body: Joi.object().keys({
      type: Joi.string()
        .valid(['intervaled', 'repeated', 'scheduled'])
        .lowercase()
        .default('scheduled'),

      date: Joi.alternatives()
        .try([
          // Joi.string().regex(CronRx),
          Joi.string(),
          Joi.number().integer(),
          Joi.date().min('now'),
        ])
        .default(() => new Date(Date.now() + 1000), 'date'), // fallback to now + 1 second

      payload: Joi.object({ target, delivery, envelope }).required(),
    }),
  }),
}
