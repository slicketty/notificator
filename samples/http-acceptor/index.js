const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const server = app.listen(8080, () => {})

const io = require('socket.io').listen(server)
io.set('origins', '*:*')

app.post('/sns', (req, res) => {
  const body = []
  req.on('data', chunk => body.push(chunk))
  req.on('end', () => {
    const res = body.join('')
    const message = JSON.parse(res)
    io.emit('message', message.Message)
  })
})
