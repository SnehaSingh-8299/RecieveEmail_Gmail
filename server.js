const express = require('express')
const imap = require('./mail')
const log = console.log
const app = express()
const path = require('path')

const PORT = 8000

app.use(
  express.urlencoded({
    extended: false
  })
)
app.use(express.json())

app.post('/email', (req, res) => {
  const { subject, email, text } = req.body
  console.log('Data: ', req.body)

  imap(email, subject, text, function (err, data) {
    if (err) {
      res.status(500).json({ message: 'Internal Erroor' })
    } else {
      res.json({ message: 'Email Sent!!!' })
    }
  })
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

// app.listen(PORT, () => log('Server is starting on PORT, ', 8080))

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})
