'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let async = require('async')
let isArray = require('lodash.isarray')
let isEmpty = require('lodash.isempty')
let isPlainObject = require('lodash.isplainobject')
let request = require('request')

let sendData = (data, callback) => {
  if (isEmpty(data.sender)) { data.sender = _plugin.config.defaultSender }

  if (isEmpty(data.receiver)) {
    data.receiver = _plugin.config.defaultReceiver
  }

  if (isEmpty(data.subject)) { data.subject = _plugin.config.defaultSubject }

  if (isEmpty(data.message)) {
    data.message = _plugin.config.defaultMessage
  }

  if (isEmpty(data.html)) {
    data.html = _plugin.config.defaultHtml
  }

  var msg = { method: 'POST',
    url: `https://api:${_plugin.config.apiKey}@api.mailgun.net/v3/${_plugin.config.serverName}/messages`,
    formData:
    {
      from: data.sender,
      to: data.receiver,
      subject: data.subject,
      text: data.message,
      html: data.html,
      cc: data.cc,
      bcc: data.bcc
    }
  }

  if (isEmpty(msg.formData.cc)) {
    delete msg.formData.cc
  }

  if (isEmpty(msg.formData.bcc)) {
    delete msg.formData.bcc
  }

  request(msg, (error) => {
    if (!error) {
      _plugin.log(JSON.stringify({
        title: 'MailGun Email sent.',
        data: data
      }))
    }

    callback(error)
  })
}

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, done)
    }, (error) => {
      if (error) {
        console.error(error)
        _plugin.logException(error)
      }
    })
  } else {
    _plugin.logException(new Error('Invalid data received. Must be a valid Array/JSON Object. Data ' + data))
  }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  _plugin.log('Mailgun Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
