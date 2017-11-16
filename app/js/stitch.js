// require("https://s3.amazonaws.com/stitch-sdks/js/library/stable/stitch.min.js");

// import { StitchClient } from "mongodb-stitch";
const stitch = require("mongodb-stitch");
const client = new stitch.StitchClient("citizensciencestitch-oakmw");

const db = client.service("mongodb", "mongodb-atlas").db("citizenScience");
client
  .login()
  .then(() =>
    db
      .collection("stitch")
      .updateOne(
        { owner_id: client.authedId() },
        { $set: { number: 42 } },
        { upsert: true }
      )
  )
  .then(() => db.collection("stitch").find({ owner_id: client.authedId() }))
  .then(docs => {
    console.log("Found docs", docs);
    console.log("[MongoDB Stitch] Connected to Stitch");
  })
  .catch(err => {
    console.error(err);
  });
