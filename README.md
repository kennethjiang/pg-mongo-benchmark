# Branch Metrics Coding Challenge

## Goal

The goal of this challenge is to measure the read and write performance for a sample dataset of Postgres and MongoDB, in order to make a choice about which one to use in a production environment.

## Setup

This package includes:

- Instructions (this file)
- Two node.js servers: one which connects to a Mongo database, and one which connects to a Postgres database
- A node.js client, which fires sample requests to the server

It's preferable to use Linux for these benchmarks – either on a remote (EC2) server, or locally through Vagrant+VirtualBox or the like (or, if you have Linux installed locally, so much the better!). You'll need, on your server:

- node.js (be sure to run `npm install` in this folder)
- Postgres (create a database and import `schema.sql` into it)
- MongoDB (create a database, and create a collection in it named `events`)

## Tasks

### Task A1: Run a write benchmark on Postgres

1. Point `POSTGRES_CONNECTION` in `server-postgres.js` at the Postgres database.
2. Come up with some way of measuring write times, either in the server or on the client.
3. Run the client using the test dataset (this should take around 30 minutes), and record your results.

### Task A2: Run a read benchmark on Postgres

Run a SQL query to find how many of each event happened in every minute of the test. Run this query several times to roughly figure out its performance (obviously, this would be more telling on a larger dataset, but we'll take what we can get).

### Task B1: Run a write benchmark on MongoDB

1. Point `MONGO_CONNECTION` in `server-mongo.js` at the MongoDB instance.
2. Come up with some way of measuring write times, either in the server or on the client.
3. Run the client using the test dataset (this should take around 30 minutes), and record your results.

### Task B2: Run a read benchmark on MongoDB

Run a query to find how many of each event happened in every minute of the test. Run this query several times to roughly figure out its performance (obviously, this would be more telling on a larger dataset, but we'll take what we can get).

## Deliverables

- A report of rough read and write times for MongoDB and Postgres (as well as results for the read queries :-)).
- Suggestions for any low-hanging fruit in speeding up the queries (especially the reads).
- A recommendation for which database to pick, given the sample load.
