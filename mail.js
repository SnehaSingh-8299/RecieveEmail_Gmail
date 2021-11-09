var Imap = require('node-imap'),
  inspect = require('util').inspect

const imap = new Imap({
  user: 'myemail@gmail.com',
  password: 'mypassword',
  port: 993,
  tls: true,
  tlsOptions: {
    ca: `-----BEGIN CERTIFICATE-----
  ....
  lTFCMEAGA1UECww5Z2VuZXJhdGVkIGJ5IEF2YXN0IEFudGl2aXJ1cyBmb3Igc2Vs
  Zi1zaWduZWQgY2VydGlmaWNhdGVzMR4wHAYDVQQKDBVBdmFzdCBXZWIvTWFpbCBT
  AQoCggEBALRBsKEY0pqPCWEqU03nAf/UBeLiiPU4h0ODs9dwl/6iUT6aMXlCtGUv
  ...
  -----END CERTIFICATE-----
  -----BEGIN CERTIFICATE-----
  ....
  Ka/fWoV6PuvHSjDy0HhpT9n/iEooOPtcmo4FIuCX7IXP8AJblienxO5MyT6M/Ljp
  Jp0XtaGUhrj/R/HP494A2Gr5BRL8Fd8z+7uIRAsDjPevVO6XpTFy0Bi489pX6Qfz
  ojgwHwYDVR0jBBgwFoAUKbbni8LPxYi9TZyxA6/UZnErojgwDQYJKoZIhvcNAQEL
  ...
  -----END CERTIFICATE-----`
  }
})

function openInbox (callback) {
  imap.openBox('INBOX', true, callback)
}

async function parse_email (body) {
  let parsed = simpleParser(body)
}

imap.once('ready', function () {
  openInbox(function (err, box) {
    if (err) throw err
    var f = imap.seq.fetch('1:3', {
      bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      struct: true
    })
    f.on('message', function (msg, seqno) {
      console.log('Message #%d', seqno)
      var prefix = '(#' + seqno + ') '
      msg.on('body', function (stream, info) {
        var buffer = ''
        stream.on('data', function (chunk) {
          buffer += chunk.toString('utf8')
        })
        stream.once('end', function () {
          console.log(
            prefix + 'Parsed header: %s',
            inspect(Imap.parseHeader(buffer))
          )
        })
      })
      msg.once('attributes', function (attrs) {
        console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8))
      })
      msg.once('end', function () {
        console.log(prefix + 'Finished')
      })
    })
    f.once('error', function (err) {
      console.log('Fetch error: ' + err)
    })
    f.once('end', function () {
      console.log('Done fetching all messages!')
      imap.end()
    })
  })
})

imap.once('error', function (err) {
  console.log(err)
})

imap.once('end', function () {
  console.log('Connection ended')
})

imap.connect()

// const nodemailer = require('nodemailer')
// const mailgun = require('nodemailer-mailgun-transport')

// const auth = {
//   auth: {
//     api_key: '',
//     domain: ''
//   }
// }

// const transporter = nodemailer.createTransport(mailgun(auth))

// const sendMail = (email, subject, text, cb) => {
//   const mailOptions = {
//     from: '',
//     to: '',
//     subject: '',
//     text: ''
//   }
//   transporter.sendMail(mailOptions, function (err, data) {
//     if (err) {
//       cb(err, null)
//     } else {
//       cb(null, data)
//     }
//   })
// }

// module.exports = sendMail
