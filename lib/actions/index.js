/**
 * Action lists provider
 */

const { AWSRoutes, CustomRoutes } = require('/config/routes')
const { awsAction, customAction } = require('./actionCreators')

module.exports = {
  ...Object.keys(AWSRoutes).reduce((accumulator, currentValue) => {
    accumulator[currentValue] = awsAction(currentValue)
    return accumulator
  }, {}),

  ...Object.keys(CustomRoutes).reduce((accumulator, currentValue) => {
    accumulator[currentValue] = customAction(currentValue)
    return accumulator
  }, {}),
}
