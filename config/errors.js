/**
 * List of predefined errors
 */

module.exports = {
  AWS_ADD_ENDPOINT_ERROR: {
    statusCode: 500,
    reason: 'Add platfrom to AWS error',
  },

  MONGODB_ADD_ENDPOINT_ERROR: {
    statusCode: 500,
    reason: 'Add platfrom to MongoDB error',
  },

  MONGODB_ENDPOINTS_ERROR: {
    statusCode: 500,
    reason: 'Endpoints data obtaining error',
  },

  MONGODB_INBOX_ERROR: {
    statusCode: 500,
    reason: 'Inbox message send error',
  },

  MONGODB_RECIPIENT_ERROR: {
    statusCode: 500,
    reason: 'Recipient data obtaining error',
  },

  MYSQL_ENVELOPE_ERROR: {
    statusCode: 500,
    reason: 'Envelope data obtaining error',
  },

  NOTIFICATIONS_NOT_ALLOWED_ERROR: {
    statusCode: 400,
    reason: 'All recipients do not allow to accept push notification',
  },

  RECIPIENTS_NOT_FOUND_ERROR: {
    statusCode: 400,
    reason: 'Recipients not found',
  },
}
