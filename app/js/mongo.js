var MongoClient = require("mongodb").MongoClient,
  assert = require("assert");

var uri =
  "mongodb://Kullaberg:BA1LHo6AZsqdesqs@citizenscience-shard-00-00-ztgdx.mongodb.net:27017,citizenscience-shard-00-01-ztgdx.mongodb.net:27017,citizenscience-shard-00-02-ztgdx.mongodb.net:27017/citizenScience?ssl=true&replicaSet=CitizenScience-shard-0&authSource=admin";
MongoClient.connect(uri, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  db.close();
});

// Authentication info for Database
// CitizenScienceApp
// CitizenScience2017

// URI for free M0 tier 512MB database
// mongodb://Kullaberg:BA1LHo6AZsqdesqs@citizenscience-shard-00-00-ztgdx.mongodb.net:27017,citizenscience-shard-00-01-ztgdx.mongodb.net:27017,citizenscience-shard-00-02-ztgdx.mongodb.net:27017/citizenScience?ssl=true&replicaSet=CitizenScience-shard-0&authSource=admin
