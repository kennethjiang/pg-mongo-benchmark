* *Both PostgreSQL and MongoDB are running on a AWS i2.4xlarge instance. IOPS/drive seems to peak at ~65k.*

* *Benchmarking concurrency level is defined as the number of benchmarking processes (such as `node mongo-writes.js`) running concurrently.*

# PostgreSQL Benchmarks

### Inserts

* When benchmarking concurrency level is 1, 37k sample data are inserted in 21secs. Throughput = **1.8k inserts/sec **
* Throughput = **38k inserts/sec** at concurrency level of 64, when it maxes out all 65k IOPS.

Notes:

* *PostgreSQL scales nicely with concurrency level. It doesn't seem to have obvious bottlenecks (compared to MongoDB below). Therefore its maximum throughput only depends on "shortest board of the bucket", which turned out to be disk IO (IOPS) in this case.*

### Selects

* Select query `SELECT name, count(*) FROM event GROUP BY name;` runs **180ms** without index, **15ms** with index.

# MongoDB Benchmarks

### Inserts

* When benchmarking concurrency level is 1, 37k sample data are inserted in 7secs. Throughput = **5.3k inserts/sec **
* Throughput peaks at **27k inserts/sec **. It is achieved when concurrency level is 8.

Notes:

* *When throughput is at 27k inserts/sec, MongoDB is generating only ~50IOPS. This is an indication that MongoDB bundles ~500 inserts into 1 disk writes. It explains why MongoDB can support higher inserts/sec than PostgreSQL when concurrency level is low. However, this also means higher possibility of data loss, as MongoDB already acknowledges an insert operation before data hits physical disk. *
* *Throughput peaks when concurrency level is 8. Neiether IPOS nor CPU is maxed out. I did a bit of invistigation and found that one `mongod` process would peak at 200% (2 cores) when concurrency reached 8 or beyond, while other `mongod` processes only consumed 2-5% CPU each. Because of this "long-pole" `mongod` process, maximum resource utilization is poor at only ~50IOPS and ~20% CPU (on 16 cores). This seems to indicate a flaw in MongoDB implementation. But it is also possible that MongoDB can be fine-tuned to achieve better utitlization.*

### Selects
* Select query `db.events.aggregate({$group : {_id: "$name", count: { $sum: 1 } } });` runs 4ms.

-----

# Recommendation

Among the 2 databases evaluated, PostgreSQL is recommended for the reasons below:

* It scales up nicely with IOPS. As opposed to that, MongoDB has a obvious bottleneck on CPU utilization.
* Lower likelihood of data loss. MongoDB's behavior to bundle ~500 inserts into 1 disk-write seems to be dangerously optimistic.

----

# Optimization
### PostgreSQL inserts

1. Scale-up: Upgrade to VM/hardward that supports higher IOPS
2. Scale-out: When upgrading IOPS is not feasible or not economical, consider sharding the database.

### PostgreSQL selects

* `CREATE INDEX event_name_ts_idx ON event(name, ts)`. This reduces the query 180ms -> 15ms.
* Even with index, this query's run time will grow linearly with the number of rows. If further optimization is desired, we can denormalize the data model by adding a table to count each event at the time it comes in.

---

# Some details (only if you are interested)

### Why didn't I benchmark using server-xxx.js

server-xxx.js can be benchmarked with simple command similar to

```bash
for i in $(seq 1 $PARALLEL_LEVEL); do curl 'http://localhost:3000/?event=asdfasdf' & done
```

However, I wrote [pg-insert.js](pg-insert.js) and [mongo-insert.js](mongo-insert.js) to do benchmarking for the following reasons:

* Assuming the goal is to benchmark databases, not web app itself, bypassing server-xxx.js gives us the shortest distance between benchmarking client and target, and hence minimizes the noises.
* Benchmarking concurrency can be easily controlled with scripts like `for i in $(seq 1 $CONCURRENCY_LEVEL); do nodejs pg-insert.js & done`

### Separating benchmarking client from target

Rather than running benchmarking client on the same VM as the target, I put them on separate VMs because:

* Benchmarking client consumes significant amount of CPU. This will interfere with databases' real performance if they run on the same VM.
* This setup is closer to a typical production env.

### Results not final

It's worth noting that these benchmarking results are preliminary. A full-fledged benchmarking should at least involve activities such as:
* Tuning the target databases;
* Generating data volume and query patterns silimar to production;
* etc.
