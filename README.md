# Mailgun Connector
[![Build Status](https://travis-ci.org/Reekoh/mailgun-connector.svg)](https://travis-ci.org/Reekoh/mailgun-connector)
![Dependencies](https://img.shields.io/david/Reekoh/mailgun-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/mailgun-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

Mailgun Connector Plugin for the Reekoh IoT Platform. Integrates a Reekoh instance with Mailgun to send emails/notifications.

## Description
This plugin sends emails/notifications based on devices' data connected to the Reekoh Instance to Mailgun.

## Configuration
To configure this plugin, a Mailgun account is needed to provide the following:

1. API Key - The Mailgun API to use.
2. Server Name - The Mailgun server to use.

Other Parameters:

1. Default HTML Message - The HTML version of the message to be sent (to be used if the email client supports HTML).
2. Default Message - The Text version of the message to be sent (to be used if the email client does not support HTML).
3. Default Sender - The default sender to be used.
4. Default Receiver -  The default receiver in which the email will be sent (for multiple recipients separate each by comma).
5. Default Subject - The default subject to use.

These parameters are then injected to the plugin from the platform.

## Sample input data
```
{
    sender: 'mailgun@sandboxb7b42b222bd5474fa3e06bdfb33d53e3.mailgun.org',
    receiver: 'receiver1@domain.com, receiver2@domain.com',
    subject: 'This is a test subject',
    message: 'This is a test message from MailGun Connector.',
    html: '<h1>This is a test message from MailGun Connector.</h1>',
    cc: 'cc1@domain.com, cc2@domain.com',
    bcc: 'bcc@doamin.com'
}
```