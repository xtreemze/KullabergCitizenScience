// require("https://s3.amazonaws.com/stitch-sdks/js/library/stable/stitch.min.js");

// import { StitchClient } from "mongodb-stitch";
const stitch = require("mongodb-stitch");
const appId = "citizensciencestitch-oakmw";
const stitchClient = new stitch.StitchClient(appId);

// Mongodb-stitch documentation https://mongodb.github.io/stitch-js-sdk/

// Anonymous Authentication
stitchClient
  .anonymousAuth()
  .then(() => console.log("logged in as: " + stitchClient.authedId()))
  .catch(e => console.log("error: ", e));

// MongoDB Conect to citizenScience Database, free M0 tier 512MB storage
const db = stitchClient
  .service("mongodb", "mongodb-atlas")
  .db("citizenScience");

// Mission Collections within the MongoDB ddatabase
const trails = db.collection("TrailCondition");
const tumlare = db.collection("Tumlare");

// Test MongoDB conectivity
stitchClient
  .login()
  .then(() =>
    db
      .collection("stitch")
      .updateOne(
        { owner_id: stitchClient.authedId() },
        { $set: { number: 42 } },
        { upsert: true }
      )
  )
  .then(() =>
    db.collection("stitch").find({ owner_id: stitchClient.authedId() })
  )
  .then(docs => {
    console.log("Found docs", docs);
    console.log("[MongoDB Stitch] Connected to Stitch");
  })
  .catch(err => {
    console.error(err);
  });
