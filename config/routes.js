/**
 * List of REST calls
 *
 * <actionName>: [<http method>, <endpoint>, <validation>]
 */

module.exports = {
  /* Amazon Web Service API wrappers. Validation happens on Amazon side. */
  AWSRoutes: {
    addPermission: ['post', '/permission'],
    checkIfPhoneNumberIsOptedOut: ['get', '/check-phone-optout'],
    confirmSubscription: ['post', '/confirm-subscription'],
    createPlatformApplication: ['post', '/application'],
    createPlatformEndpoint: ['post', '/platform'],
    createTopic: ['post', '/topic'],
    deleteEndpoint: ['delete', '/endpoint'],
    deletePlatformApplication: ['delete', '/application'],
    deleteTopic: ['delete', '/topic'],
    getEndpointAttributes: ['get', '/endpoint'],
    getPlatformApplicationAttributes: ['get', '/platform'],
    getSMSAttributes: ['get', '/sms'],
    getSubscriptionAttributes: ['get', '/subscription'],
    getTopicAttributes: ['get', '/topic'],
    listEndpointsByPlatformApplication: ['get', '/endpoints'],
    listPhoneNumbersOptedOut: ['get', '/list-phone-optout'],
    listPlatformApplications: ['get', '/applications'],
    listSubscriptions: ['get', '/subscriptions'],
    listSubscriptionsByTopic: ['get', '/topic/subscriptions'],
    listTopics: ['get', '/topics'],
    optInPhoneNumber: ['post', '/phone-optin'],
    publish: ['post', '/publish'],
    removePermission: ['delete', '/permission'],
    setEndpointAttributes: ['post', '/endpoint'],
    setPlatformApplicationAttributes: ['post', '/platform/attributes'],
    setSMSAttributes: ['post', '/sms'],
    setSubscriptionAttributes: ['post', '/subscription'],
    setTopicAttributes: ['post', '/topic/attributes'],
    subscribe: ['post', '/subscribe'],
    unsubscribe: ['post', '/unsubscribe'],
  },

  /* Route with custom logic. */
  CustomRoutes: {
    broker: ['post', '/broker', true],
    secretary: ['post', '/secretary', true],
    secretaryDelete: ['delete', '/secretary/:id', false],
  },
}
