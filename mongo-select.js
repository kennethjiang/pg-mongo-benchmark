var MongoClient = require('mongodb').MongoClient, http = require('http'), url = require('url');

var MONGO_CONNECTION = 'mongodb://172.31.41.237:27017/app';

MongoClient.connect(MONGO_CONNECTION, function(err, db) {

    var REPEATS = 100;
    done = 0;
    console.time('SELECT');

    var collection = db.collection('events');
    for( var i = 0; i < REPEATS; i++ ) {

       collection.aggregate(
            {
                $group : { _id : "$name", count : { $sum: 1 } }
            }, function(err) {

                if (err) {
                    console.warn("Error in SELECT!");
                    process.exit(1);
                }
                else {
                    done++;
                }
    
                if (done >= REPEATS) {
                    db.close();
    		console.timeEnd('SELECT');
                }
    
        });        
    }
});
