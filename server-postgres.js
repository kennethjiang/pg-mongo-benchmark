var pg = require('pg.js'), http = require('http'), url = require('url');

var POSTGRES_CONNECTION = 'postgres://root:root@localhost:5432/app';

pg.connect(POSTGRES_CONNECTION, function(err, client, done) {
	if (err) { throw err; }

	http.createServer(function(req, res) {
		client.query('INSERT INTO event (ts, name) VALUES ($1, $2)', [ new Date(), url.parse(req.url, true).query.event ], function(err) {
			done();

			if (err) {
				console.warn(err);
				res.writeHead(500, { 'Content-Type': 'text/plain' });
				res.end('Failed\n');
			}
			else {
				res.writeHead(200, { 'Content-Type': 'text/plain' });
				res.end('OK\n');
			}
		});
	}).listen(3000);
	console.log('Server running at http://locahost:3000/');
});
