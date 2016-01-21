'use strict';

var platform = require('./platform'),
    isPlainObject = require('lodash.isplainobject'),
    isEmpty = require('lodash.isempty'),
    request = require('request'),
    config;

platform.on('data', function (data) {
    if(isPlainObject(data)){
        if(isEmpty(data.sender))
            data.sender = config.default_sender;

        if(isEmpty(data.receiver))
            data.receiver = config.default_receiver;

        if(isEmpty(data.subject))
            data.subject = config.default_subject;

        if(isEmpty(data.message))
            data.message = config.default_message;

        if(isEmpty(data.html))
            data.html = config.default_html;

        var msg = { method: 'POST',
            url: 'https://api:'+ config.api_key +'@api.mailgun.net/v3/'+ config.server_name +'/messages',
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
        };

        if(isEmpty(msg.cc))
            delete msg.cc;

        if(isEmpty(msg.bcc))
            delete msg.bcc;

        request(msg, function (error, response, body) {
            if(error){
                console.error(error);
                platform.handleException(error);
            }
            else{
                platform.log(JSON.stringify({
                    title: 'MailGun Email sent.',
                    data: data
                }));
            }
        });
    }
    else
        platform.handleException(new Error('Invalid data received. Must be a valid JSON Object. Data ' + data));
});

platform.once('close', function () {
    platform.notifyClose();
});

platform.once('ready', function (options) {
    config = options;

	platform.notifyReady();
	platform.log('MailGun Connector has been initialized.');
});