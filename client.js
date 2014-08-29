var http = require('http'), fs = require('fs'), url = require('url');

var URL = 'http://localhost:3000/event';

var data = JSON.parse(String(fs.readFileSync('./data.json')));

function request() {
	if (!data.length) {
		console.log('Test finished.');
		return;
	}

	var datum = data.shift();

	var options = url.parse(URL + '?event=' + datum[0]);
	options.agent = false;
	http.get(options, function(res) { }).on('error', console.warn);

	setTimeout(request, datum[1]);
}

request();
