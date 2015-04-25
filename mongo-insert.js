var MongoClient = require('mongodb').MongoClient, http = require('http'), url = require('url');

var MONGO_CONNECTION = 'mongodb://172.31.41.237:27017/app';

var data = require('./data.json');

MongoClient.connect(MONGO_CONNECTION, function(err, db) {

    console.time('INSERT');
    done = 0;

    var collection = db.collection('events');
    for( var i = 0; i < data.length; i++ ) {

       collection.insert({ ts: new Date(), name: data[i][0] }, function(err) {
            if (err) {
                console.warn("Error in INSERT!");
                process.exit(1);
            }
            else {
                done++;
            }

            if (done >= data.length) {
                db.close();
		console.timeEnd('INSERT');
            }

        });        
    }
});
