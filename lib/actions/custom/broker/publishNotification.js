/**
 * Publish notification
 */

module.exports = ({ envelope, allowedRecipients, client, awsAction }) => {
  /* Generate JSON for push message */
  const Message = `{
    "default": "",
    "GCM": "{\\"notification\\":{\\"text\\":\\"${envelope.title}\\"}}",
    "APNS": "{\\"aps\\":{\\"alert\\": \\"${envelope.title}\\"}}",
    "APNS_SANDBOX": "{\\"aps\\":{\\"alert\\": \\"${envelope.title}\\"}}"
  }`

  /* Send push notification */
  awsAction('publish')({
    body: {
      Message,
      TopicArn: process.env.AWS_PUSH_TOPIC_ARN,
      MessageStructure: 'json',
      MessageAttributes: {
        id: {
          DataType: 'String.Array',
          StringValue: JSON.stringify(allowedRecipients),
        },
        client: {
          DataType: 'Number',
          StringValue: client.toString(),
        },
      },
    },
  })
}
