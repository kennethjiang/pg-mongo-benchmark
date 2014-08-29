  var MongoClient = require('mongodb').MongoClient, http = require('http'), url = require('url');

var MONGO_CONNECTION = 'mongodb://localhost:27017/app';

MongoClient.connect(MONGO_CONNECTION, function(err, db) {
	if (err) { throw err; }
	var collection = db.collection('events');

	http.createServer(function(req, res) {
		collection.insert({ ts: new Date(), name: url.parse(req.url, true).query.event }, function(err) {
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
