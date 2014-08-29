var http = require('http'), fs = require('fs'), url = require('url');

var URL = 'http://localhost:3000/event';

var URLParsed = url.parse(URL),
	data = JSON.parse(String(fs.readFileSync('./data.json')));

function request() {
	if (!data.length) {
		console.log('Test finished.');
		return;
	}

	var datum = data.shift();

	http.request({
		port: URLParsed.port || 80
		host: URLParsed.host,
		path: URLParsed.path + '?event=' + datum[0]
	}, function(response) {
		response.on('end', function() {});
	}).end();

	setTimeout(run, datum[1]);
}

request();
