const { SES } = require('aws-sdk')

const ses = new SES()

exports.handler = (event, context) => {
  // console.log('Received event:', JSON.stringify(event, null, 2))
  const message = event.Records[0].Sns
  // console.log('From SNS:', message)

  const params = {
    Destination: {
      ToAddresses: ['to@mail.com'],
    },
    Message: {
      Body: {
        Text: {
          Data: message.Message,
        },
      },
      Subject: {
        Data: message.Subject,
      },
    },
    Source: 'from@mail.com',
  }

  // console.log('Sending email')
  ses.sendEmail(params, (err /* , data */) => {
    if (err) {
      // console.log('Error: ', err)
      context.fail(err)
    } else {
      // console.log('Email sent')
      // console.log('Email data', data)
      context.succeed(event)
    }
  })
}
