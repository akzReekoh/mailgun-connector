'use strict'

const amqp = require('amqplib')

const API_KEY = 'key-a39d203d081c1ed4eca747e1396508eb'
const SERVER_NAME = 'sandboxb7b42b222bd5474fa3e06bdfb33d53e3.mailgun.org'

let _channel = null
let _conn = null
let app = null

describe('Mailgun Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
      apiKey: API_KEY,
      serverName: SERVER_NAME,
      defaultSender: 'mailgun@sandboxb7b42b222bd5474fa3e06bdfb33d53e3.mailgun.org',
      defaultReceiver: 'akzdinglasan@gmail.com',
      defaultSubject: 'This is a default subject',
      defaultMessage: 'This is a default message from MailGun Connector.',
      defaultHtml: '<h1>This is a default message from MailGun Connector.</h1>'
    })
    process.env.INPUT_PIPE = 'ip.mailgun'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
        sender: 'mailgun@sandboxb7b42b222bd5474fa3e06bdfb33d53e3.mailgun.org',
        receiver: 'akzdinglasan@gmail.com',
        subject: 'This is a test subject',
        message: 'This is a test message from MailGun Connector.',
        html: '<h1>This is a test message from MailGun Connector.</h1>',
        cc: 'adinglasan@reekoh.com',
        bcc: 'adinglasan@reekoh.com'
      }

      _channel.sendToQueue('ip.mailgun', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})
