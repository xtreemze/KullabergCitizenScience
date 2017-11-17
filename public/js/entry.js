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

// Required for MongoDB database interfacing https://mongodb.github.io/stitch-js-sdk/Collection.html#updateOne
__webpack_require__(69);

// Empty template string to gather and hold html for mission cards in memory
let missionCardsHTML = ``;

// The object that holds the parameters for missions and html for the forms
let forms = {};

// The DOM element that holds the mission cards
const missionsElement = document.getElementById("missions");
// missionsElement.innerHTML += `<h5 class="blue-text text-darken-3">Choose Your Mission</h3>`;

// Collecting all Missions in a Set
let Missions = new Set();

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
    // Data for form submission goes inside the monitor function and data retrieval sorting goes in the analyze function
    parameters = { monitor: function() {}, analyze: function() {} },
    image = __webpack_require__(17)
  }) {
    this.title = title;
    this.description = description;
    this.parameters = parameters;
    this.image = image;
    // Currently unused positioning example
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
    missionCardsHTML += this.card;
  }
}

// Create the Missions
trails = new Mission({
  title: "Trail Conditions",
  description: "Participate in monitoring trail conditions in Kullaberg.",
  image: __webpack_require__(17),
  parameters: {
    monitor: function() {
      let parameters = `<form>
        <label>Georeference: ["North", "East", "Altitude"]</label>
        <label>Date:
                <input id="Date" type="date">
        </label>
        <label>
                RootsExposed:
                <input type="radio">
        </label>
        <label>
                Flooded:
                <input type="radio"> </label>
        <label>
                FallenTreesOnTrail:
                <input type="radio"> </label>
        <label>
                Risk from fallen trees or branches:
                <input type="radio"> </label>
        <label>
                Slippery:
                <input type="radio"> </label>
        <label>
                Sharp Stones:
                <input type="radio">
        </label>
        <label>
                Thorny vegetation at the edge of the path:
                <input type="radio">
        </label>
        <label>
                Bifurcation - widening (i):
                <input type="radio">
        </label>
        <label>
                Erosion (i): ["Low", "Medium", "High"] A. Support infrastructure (handrails, ropes, steps)":
                <input type="text">
        </label>
        <label>
                B. Perception about the use (many people, conflicts betwen hikers, horeses, bicycles) Please describe:
                <input type="text">
        </label>
</form>
`;

      let form = {};
    },
    analyze: function() {}
  }
});

tumlare = new Mission({
  title: "Porpoise Observation",
  description:
    "Participate in monitoring porpoise whale activity around Kullaberg.",
  image: __webpack_require__(70)
});

// Additional missions go here! test = new Mission({});

// Add HTML Mission Cards to the DOM
missionsElement.innerHTML = missionCardsHTML;


/***/ }),

/***/ 69:
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


/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./img/tumlare.jpg?a0b7d3b21f32536b83f0e5192c541a22";

/***/ })

},[65]);
//# sourceMappingURL=entry.js.map?c4cbcb150ae2bf3e1f8b