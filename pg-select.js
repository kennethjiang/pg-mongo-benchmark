var pg = require('pg');
var POSTGRES_CONNECTION = 'postgres://root:root@172.31.41.237:5432/app';

new pg.Client(POSTGRES_CONNECTION).connect(function(err, client) {

    var REPEATS = 10;
    var done = 0;
    console.time('SELECT');
    for( var i = 0; i < REPEATS; i++ ) {
        client.query('SELECT name, count(*) FROM event GROUP BY name', [], function(err) {
            if (err) {
                console.warn("Error in SELECT!" + err);
                process.exit(1);
            }
            else {
                done++;
            }

            if (done >= REPEATS) {
                client.end();
		console.timeEnd('SELECT');
            }

        });        
    }
});
