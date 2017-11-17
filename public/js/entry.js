webpackJsonp([1],{

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./img/trail.jpg?e5ae226dede12f864004ec83d0addd44";

/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7);
__webpack_require__(6);
__webpack_require__(8);
__webpack_require__(66);
__webpack_require__(9);
__webpack_require__(67);
__webpack_require__(68);
__webpack_require__(70);
// require("./app/js/mongo");
// require("./app/js/geolocation");


/***/ }),

/***/ 66:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 67:
/***/ (function(module, exports) {

$(".modal").modal();
window.addEventListener("load", function() {
  document.getElementById("loading").remove();
});


/***/ }),

/***/ 68:
/***/ (function(module, exports, __webpack_require__) {

let Missions = new Set();
const missionsElement = document.getElementById("missions");
// missionsElement.innerHTML += `<h5 class="blue-text text-darken-3">Choose Your Mission</h3>`;

class Mission {
  /**
   * Creates an instance of Mission.
   * @param {object} {
   *     title = "Title",
   *     description = "Description",
   *     parameters = { monitor: function() {}, analyze: function() {} },
   *     image = require("../img/trail.jpg")
   *   } 
   * @memberof Mission
   */
  constructor({
    title = "Title",
    description = "Description",
    parameters = { monitor: function() {}, analyze: function() {} },
    image = __webpack_require__(17)
  }) {
    this.title = title;
    this.description = description;
    this.parameters = parameters;
    this.image = image;
    this.getPosition = `<div class="col s12 m6">
  <div class="card">
    <div class="card-content">
      <span class="card-title">Your Position</span>
      <span id="coordinates">
        You have not granted permission for us to locate your position.
      </span>
    </div>
  </div>
</div>
<div id="sendButton" class="col s12 center"> </div>
`;
    this.card = `<div class="cardContainer" id="${this.title}">
  <div class="col s12 m6 l4">
    <div class="card medium">
      <div class="card-image">
        <img src="${this.image}">
        <span class="card-title">${this.title}</span>
      </div>
      <div class="card-content">
        <p>${this.description}</p>
      </div>
      <div class="card-action">
        <a class="pointer" onclick="${this.parameters.monitor()}">Monitor</a>
        <a class="pointer" onclick="${this.parameters.analyze()}">Analyze</a>
      </div>
    </div>
  </div>
</div>
`;
    Missions.add(this);

    missionsElement.innerHTML += this.card;
  }
}

trails = new Mission({
  title: "Trail Conditions",
  description: "Participate in monitoring trail conditions in Kullaberg.",
  image: __webpack_require__(17)
});

tumlare = new Mission({
  title: "Porpoise Activity",
  description: "Participate in monitoring porpoise activity in Kullaberg.",
  image: __webpack_require__(69)
});

// test = new Mission({});


/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./img/tumlare.jpg?a0b7d3b21f32536b83f0e5192c541a22";

/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

// require("https://s3.amazonaws.com/stitch-sdks/js/library/stable/stitch.min.js");

// import { StitchClient } from "mongodb-stitch";
const stitch = __webpack_require__(10);
const appId = "citizensciencestitch-oakmw";
const stitchClient = new stitch.StitchClient(appId);

// Mongodb-stitch documentation https://mongodb.github.io/stitch-js-sdk/

// Anonymous Authentication
stitchClient
  .anonymousAuth()
  .then(() => console.log("logged in as: " + stitchClient.authedId()))
  .catch(e => console.log("error: ", e));

const db = stitchClient
  .service("mongodb", "mongodb-atlas")
  .db("citizenScience");

const trails = db.collection("TrailCondition");
const tumlare = db.collection("Tumlare");

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


/***/ })

},[65]);
//# sourceMappingURL=entry.js.map?aab1185dce5761ddfb67