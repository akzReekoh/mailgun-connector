'use strict';

const API_KEY = 'key-a39d203d081c1ed4eca747e1396508eb',
    SERVER_NAME = 'sandboxb7b42b222bd5474fa3e06bdfb33d53e3.mailgun.org';

var cp     = require('child_process'),
	assert = require('assert'),
	connector;

describe('Connector', function () {
	this.slow(5000);

	after('terminate child process', function (done) {
        this.timeout(7000);
        setTimeout(function(){
            connector.kill('SIGKILL');
            done();
        }, 5000);
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			assert.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			connector.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			connector.send({
				type: 'ready',
				data: {
					options: {
						api_key: API_KEY,
                        server_name: SERVER_NAME,
                        default_sender: 'mailgun@sandboxb7b42b222bd5474fa3e06bdfb33d53e3.mailgun.org',
                        default_receiver: 'akzdinglasan@gmail.com',
                        default_subject: 'This is a default subject',
                        default_message: 'This is a default message from MailGun Connector.',
                        default_html: '<h1>This is a default message from MailGun Connector.</h1>'
					}
				}
			}, function (error) {
				assert.ifError(error);
			});
		});
	});

	describe('#data', function () {
		it('should process the JSON data', function (done) {
            connector.send({
                type: 'data',
                data: {
                    sender: 'mailgun@sandboxb7b42b222bd5474fa3e06bdfb33d53e3.mailgun.org',
                    receiver: 'akzdinglasan@gmail.com',
                    subject: 'This is a test subject',
                    message: 'This is a test message from MailGun Connector.',
                    html: '<h1>This is a test message from MailGun Connector.</h1>',
                    cc: 'adinglasan@reekoh.com',
                    bcc: 'adinglasan@reekoh.com'
                }
            }, done);
		});
	});

	describe('#data', function () {
		it('should process the Array data', function (done) {
			connector.send({
				type: 'data',
				data: [
						{
							sender: 'mailgun@sandboxb7b42b222bd5474fa3e06bdfb33d53e3.mailgun.org',
							receiver: 'akzdinglasan@gmail.com',
							subject: 'This is a test subject',
							message: 'This is a test message from MailGun Connector.',
							html: '<h1>This is a test message from MailGun Connector.</h1>',
							cc: 'adinglasan@reekoh.com',
							bcc: 'adinglasan@reekoh.com'
						},
						{
							sender: 'mailgun@sandboxb7b42b222bd5474fa3e06bdfb33d53e3.mailgun.org',
							receiver: 'akzdinglasan@gmail.com',
							subject: 'This is a test subject',
							message: 'This is a test message from MailGun Connector.',
							html: '<h1>This is a test message from MailGun Connector.</h1>',
							cc: 'adinglasan@reekoh.com',
							bcc: 'adinglasan@reekoh.com'
						}
					]
			}, done);
		});
	});
});