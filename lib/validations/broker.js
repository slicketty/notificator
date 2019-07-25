/**
 * Broker validation
 */

const { celebrate, Joi } = require('celebrate')

const target = Joi.object({
  client: Joi.number().required(),
  segment: Joi.boolean().default(false),
  recipient: Joi.string(),
  recipients: Joi.array()
    .items(Joi.string())
    .default([]),
  query: Joi.object().default(undefined),
}).required()

const delivery = Joi.array()
  .items(Joi.string().valid(['message', 'push']))
  .default([])

const envelope = Joi.object({
  type: Joi.string()
    .valid(['asset1', 'asset2', 'asset3'])
    .lowercase()
    .trim()
    .required(),

  id: Joi.alternatives()
    .try([Joi.string(), Joi.number()])
    .required(),
})

module.exports = {
  broker: celebrate({
    body: Joi.object().keys({
      target,
      delivery,
      envelope,
    }),
  }),

  target,
  delivery,
  envelope,
}
