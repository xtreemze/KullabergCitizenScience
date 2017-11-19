// require("https://s3.amazonaws.com/stitch-sdks/js/library/stable/stitch.min.js");

// import { StitchClient } from "mongodb-stitch";
const stitch = require("mongodb-stitch");
const appId = "citizensciencestitch-oakmw";
const stitchClient = new stitch.StitchClient(appId);

// Mongodb-stitch documentation https://mongodb.github.io/stitch-js-sdk/

// Anonymous Authentication
// stitchClient
//   .anonymousAuth()
//   .then(() => console.log("logged in as: " + stitchClient.authedId()))
//   .catch(e => console.log("error: ", e));

// MongoDB Conect to citizenScience Database, free M0 tier 512MB storage
const db = stitchClient
  .service("mongodb", "mongodb-atlas")
  .db("citizenScience");

// Mission Collections within the MongoDB ddatabase
const dbTrail = db.collection("TrailCondition");
const dbTumlare = db.collection("Tumlare");

// Test MongoDB conectivity
/**
 * Update Database
 * use dbTrail or dbTumlare
 * @param {string} database 
 * @param {object} set 
 */
const updateDB = function(database, set) {
  let variables = {};
  (variables.database = database),
    (variables.set = set),
    stitchClient
      .login()
      .then(() =>
        [variables.database].updateOne(
          { owner_id: stitchClient.authedId() },
          { $set: [variables.set] },
          { upsert: true }
        )
      )
      .then(() =>
        [variables.database].find({ owner_id: stitchClient.authedId() })
      )
      .then(docs => {
        console.log("Found docs", docs);
        Materialize.toast(
          "[MongoDB Stitch] Connected to Database",
          8000,
          "blue darken-3 white-text"
        );
      })
      .catch(err => {
        console.error(err);
      });
};
