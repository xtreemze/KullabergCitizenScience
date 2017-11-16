var MongoClient = require("mongodb").MongoClient;
, assert = require('assert');

var uri =
  "mongodb://kay:myRealPassword@mycluster0-shard-00-00-wpeiv.mongodb.net:27017,mycluster0-shard-00-01-wpeiv.mongodb.net:27017,mycluster0-shard-00-02-wpeiv.mongodb.net:27017/admin?ssl=true&replicaSet=Mycluster0-shard-0&authSource=admin";
MongoClient.connect(uri, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    db.close();
});
