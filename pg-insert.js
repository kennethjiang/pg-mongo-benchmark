var pg = require('pg');
var POSTGRES_CONNECTION = 'postgres://root:root@172.31.41.237:5432/app';

var data = require('./data.json');

new pg.Client(POSTGRES_CONNECTION).connect(function(err, client) {

    console.time('INSERT');
    done = 0;
    for( var i = 0; i < data.length; i++ ) {
        client.query('INSERT INTO event (ts, name) VALUES ($1, $2)', [ new Date(), data[i][0] ], function(err) {
            if (err) {
                console.warn("Error in INSERT!");
                process.exit(1);
            }
            else {
                done++;
            }

            if (done >= data.length) {
                client.end();
		console.timeEnd('INSERT');
            }

        });        
    }
});
