webpackJsonp([1],{

/***/ 17:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./img/trail.jpg?e5ae226dede12f864004ec83d0addd44";

/***/ }),

/***/ 65:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7);
__webpack_require__(6);
// require("./node_modules/mdi/css/materialdesignicons.css");
// require("./node_modules/material-icons/css/material-icons.css");
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
// require("./stitch");

// import { StitchClient } from "mongodb-stitch";
const stitch = __webpack_require__(10);
const appId = "citizensciencestitch-oakmw";
const stitchClient = new stitch.StitchClient(appId);

// MongoDB Conect to citizenScience Database, free M0 tier 512MB storage
const db = stitchClient
  .service("mongodb", "mongodb-atlas")
  .db("citizenScience");
  

// Function to Upload data to DB
const updateDB = function(database, set) {
  window.variables = {};
  variables.database = database;
  // variables.setp = JSON.stringify(set);
  // variables.setc = JSON.parse(set);
  // variables.setc = set;
  variables.set = set;
  variables.set['owner_id'] = stitchClient.authedId();
    stitchClient
      .login()
      .then(() =>
      db.collection(database).insertOne(
         variables.set
        )
      ).catch(err => { 
              Materialize.toast(
                "[MongoDB Stitch]" + err,
                12000,
                "blue darken-3 white-text"
              );
      });
};

window.collectInputs = function(database) {
  window.form = parent.document.getElementsByTagName("form")[0];
  window.data = {};
  // window.data.push(`"_id": "${new Date(Date.now()).toISOString()}"`);
  // window.data["_id"] = new Date(Date.now()).toISOString();
  window.elements = form.elements;
  for (e = 0; e < elements.length; e++) {
    if (elements[e].id.length > 0) {
      if (elements[e].type == "checkbox") {
        // window.data.push(`"${elements[e].id}": ${elements[e].checked}`);
        window.data[elements[e].id] = elements[e].checked;
      } else if (elements[e].type == "number"){
        window.data[elements[e].id] = elements[e].value;
        // window.data.push(`"${elements[e].id}": ${elements[e].value}`);
      } else if (elements[e].value.length > 0){
        window.data[elements[e].id] = elements[e].value;
        // window.data.push(`"${elements[e].id}": "${elements[e].value}"`);
      }

    }
  }
  // let stringData = `{ ${data.join(`, `)} }`;
  let stringData = window.data;
  // console.log(stringData);
  updateDB(database, stringData);
  // Materialize.toast(stringData, 8000, "blue white-text darken-3");
};

// Empty template string to gather and hold html for mission cards in memory
let missionCardsHTML = ``;
window.geoReference = {};

// The object that holds the parameters for missions and html for the forms
let forms = {};

// The DOM element that holds the mission cards
const missionsElement = document.getElementById("missions");
window.missionsElement = missionsElement;
// missionsElement.innerHTML += `<h5 class="blue-text text-darken-3">Choose Your Mission</h3>`;

// Collecting all Missions in a Set
let Missions = new Set();

class Mission {
  constructor({
    shortName = "shortName",
    title = "Title",
    description = "Description",
    // Data for form submission goes inside the monitor function and data retrieval sorting goes in the analyze function
    monitor = ``,
    analyze = ``,
    database = "mongoDbCollection",
    image = __webpack_require__(17)
  }) {
    this.shortName = shortName;
    this.title = title;
    this.description = description;
    this.image = image;
    this.database = database;
    this.monitor = monitor;
    this.analyze = analyze;
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
        <a class="pointer" onclick="${this.shortName}.monitor()"}">Monitor</a>
        <a class="pointer" onclick="${this.shortName}.analyze()">Analyze</a>
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
  shortName: "trails",
  title: "Trail Condition",
  database: "TrailCondition",
  description: "Participate in monitoring trail conditions in Kullaberg.",
  image: __webpack_require__(17),
  monitor: function() {
    let content = ``;
    navigator.geolocation.getCurrentPosition(position => {
      (window.geoReference = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        alt: position.coords.altitude || 0
      }),
        () => {
          console.log(
            "We are unable to locate your device. Please describe your location as best you can."
          );
          window.geoReference = {
            lat: "Latitude",
            long: "Longitude",
            alt: "Altitude"
          };
        },
        {
          enableHighAccuracy: true
        };
      content += `<div class="row">
  <form>
    <h4 class="col s12">${this.title}</h4>
    <h5 class="col s12">Georeference</h5>
    <p class="input-text col s12 m3">
      <label for="Latitude">Latitude</label>
      <input id="Latitude" type="number" value="${window.geoReference.lat}">
    </p>
    <p class="input-text col s12 m3">
      <label for="Longitude">Longitude</label>
      <input id="Longitude" type="number" value="${window.geoReference.long}">
    </p>
    <p class="input-text col s12 m3">
      <label for="Altitude">Altitude</label>
      <input id="Altitude" type="number" value="${window.geoReference.alt}">
    </p>
    <div class="input-field col s12 m3">
      <label class="" for="Date">Date</label>
      <input id="Date" type="text" class="datepicker" data-value="${window.Date.now()}">
    </div>
    <h5 class="col s12">Select All that Apply</h5>
    <p class="col s12 m4">
      <input id="Roots Exposed" type="checkbox">
      <label for="Roots Exposed">Roots Exposed</label>
    </p>
    <p class="col s12 m4">
      <input id="Flooded" type="checkbox">
      <label for="Flooded">Flooded</label>
    </p>
    <p class="col s12 m4">
      <input id="Bifurcation" type="checkbox">
      <label for="Bifurcation">Bifurcation - Widening</label>
    </p>
    <p class="col s12 m4">
      <input id="Fallen Trees" type="checkbox">
      <label for="Fallen Trees">Fallen Trees on Trail</label>
    </p>
    <p class="col s12 m4">
      <input id="Slippery" type="checkbox">
      <label for="Slippery">Slippery</label>
    </p>
    <p class="col s12 m4">
      <input id="Sharp Stones" type="checkbox">
      <label for="Sharp Stones">Sharp Stones</label>
    </p>
    <p class="col s12 m4">
      <input id="Thorns" type="checkbox">
      <label for="Thorns">Thorny Vegetation on the Edge</label>
    </p>
    <p class="col s12 m4">
      <input id="Risk" type="checkbox">
      <label for="Risk">Risk From Fallen Trees or Branches</label>
    </p>
    <p class="input-field col s12 m4">
      <select id="Erosion">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <label for="Erosion">Erosion</label>
    </p>
    <h5 class="col s12">Please Describe</h5>
    <p class="input-field col s12 m6">
      <textarea id="Support Infrastructure" class="materialize-textarea"></textarea>
      <label for="Support Infrastructure">Support Infrastructure: handrails, ropes, steps</label>
    </p>
    <p class="input-field col s12 m6">
      <textarea id="Use Perception" class="materialize-textarea"></textarea>
      <label for="Use Perception">
        Trail Usage: many people, conflicts betwen hikers, horses, bicycles</label>
    </p>
    <div class="file-field input-field col s12">
      <div class="btn blue darken-3 white-text">
        <span>Photos</span>
        <input id="Photos" accept="image/*" type="file" multiple>
      </div>
      <div class="file-path-wrapper">
        <input accept="image/*" class="file-path validate" type="text" placeholder="Upload one or more photographs of the trail.">
      </div>
    </div>
    </form>
    <button class="section col s12 btn btn-large waves-effect waves-light green darken-2 white-text" type="submit" name="action" onclick="collectInputs('${this.database}')">Submit
      <i class="material-icons right">send</i>
    </button>
</div>
`;
      missionsElement.innerHTML = content;
      navigationBreadcrumbs.innerHTML = `
<a onclick="showMissions()" class="pointer breadcrumb">Missions</a>
<a onclick="showMissions()" class="pointer breadcrumb">${this.title}</a>
<a class="pointer breadcrumb">Monitor</a>
`;
      $(".datepicker").pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 2, // Creates a dropdown of 15 years to control year,
        today: "Today",
        clear: "Clear",
        close: "Ok",
        closeOnSelect: false // Close upon selecting a date,
      });
      $("select").material_select();
      if (!Materialize == false) {
        Materialize.updateTextFields();
      }
    });
  }
});

tumlare = new Mission({
  shortName: "tumlare",
  title: "Porpoise Observation",
  database: "Tumlare",
  description:
    "Participate in monitoring porpoise whale activity around Kullaberg.",
  image: __webpack_require__(69),
  monitor: function() {
    let content = ``;
    navigator.geolocation.getCurrentPosition(position => {
      (window.geoReference = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        alt: position.coords.altitude || 0
      }),
        () => {
          console.log(
            "We are unable to locate your device. Please describe your location as best you can."
          );
          window.geoReference = {
            lat: "Latitude",
            long: "Longitude",
            alt: "Altitude"
          };
        },
        {
          enableHighAccuracy: true
        };
      content += `<div class="row">
  <form>
    <h4 class="col s12">${this.title}</h4>
    <h5 class="col s12">Location of Sighting</h5>
    <p class="input-text col s12 m4">
      <label for="Latitude">Latitude</label>
      <input id="Latitude" type="number" value="${window.geoReference.lat}">
    </p>
    <p class="input-text col s12 m4">
      <label for="Longitude">Longitude</label>
      <input id="Longitude" type="number" value="${window.geoReference.long}">
    </p>

    <div class="input-field col s12 m4">
        <label class="" for="Date">Date</label>
      <input id="Date" type="text" class="datepicker" data-value="${window.Date.now()}">
    </div>
    <p class="input-text col s12 m8">
      <label for="Species">Species</label>
      <input id="Species" type="text" value="Porpoise">
    </p>
    <p class="col s12 m4">
        <input id="Binoculars Used" type="checkbox">
        <label for="Binoculars Used">Observation Made with Binoculars</label>
      </p>
      <h5 class="col s12">Quantity</h5>
    <p class="col s8 range-field">
      <input id="Quantity" type="range" min="1" max="10">
      <label for="Quantity">Quantity</label>
    </p>
    <p class="col s4">
      <input id="Uncertain Quantity" type="checkbox">
      <label for="Uncertain Quantity">Uncertain Quantity</label>
    </p>
    <h5 class="col s12">Behavior</h5>
    <p class="input-field col s12 m6">
      <select id="behavior">
        <option value="Constant Heading, Regular Diving">Constant Heading, Regular Diving</option>
        <option value="Varied Heading, Irregular Diving">Varied Heading, Irregular Diving</option>
        <option value="Slow Movement, Long Time at Surface">Slow Movement, Long Time at Surface</option>
        <option value="Jumping">Jumping</option>
        <option value="Found Dead / Injured">Found Dead / Injured</option>
      </select>
      <label for="behavior">Behavior</label>
    </p>
    <p class="input-field col s12 m6">
      <input id="Other Behavior" class="" type="text"></input>
      <label for="Other Behavior">Other Behavior (optional)</label>
    </p>
    <h5 class="col s12">Conditions</h5>
    <p class="input-field col s12 m6">
      <select id="Ocean Conditions">
        <option value="Sea Like a Mirror">Sea Like a Mirror</option>
        <option value="Very Calm / Ripples">Very Calm / Ripples</option>
        <option value="Small Wavelets">Small Wavelets</option>
        <option value="No Whitecaps / Small Waves">No Whitecaps / Small Waves</option>
        <option value="Few Whitecaps / Waves with Whitecaps">Few Whitecaps / Waves with Whitecaps</option>
      </select>
      <label for="Ocean Conditions">Appearance of the Ocean</label>
    </p>
    <p class="input-field col s12 m6">
      <select id="Weather">
        <option value="Sunny">Sunny</option>
        <option value="Cloudy">Cloudy</option>
        <option value="Rainy">Rainy</option>
        <option value="Foggy">Foggy</option>
        <option value="Misty">Misty</option>
      </select>
      <label for="Weather">Weather Conditions</label>
    </p>

    <h5 class="col s12">Comments</h5>
    <p class="input-field col s12">
      <textarea id="Comments" class="materialize-textarea"></textarea>
      <label for="Comments">Additional Comments (optional)</label>
    </p>
    <div class="file-field input-field col s12">
      <div class="btn blue darken-3 white-text">
        <span>Photos</span>
        <input id="Photos" accept="image/*" type="file" multiple>
      </div>
      <div class="file-path-wrapper">
        <input class="file-path validate" type="text" placeholder="Upload one or more photographs of the sighting.">
      </div>
    </div>
    </form>
    <button class="section col s12 btn btn-large waves-effect waves-light green darken-2 white-text" type="submit" onclick="window.collectInputs('${this
      .database}')" name="action">Submit
      <i class="material-icons right">send</i>
    </button>
</div>
`;
      missionsElement.innerHTML = content;
      navigationBreadcrumbs.innerHTML = `
      <a onclick="showMissions()" class="pointer breadcrumb">Missions</a>
      <a onclick="showMissions()" class="pointer breadcrumb">${this.title}</a>
      <a class="pointer breadcrumb">Monitor</a>
      `;
      $(".datepicker").pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 2, // Creates a dropdown of 15 years to control year,
        today: "Today",
        clear: "Clear",
        close: "Ok",
        closeOnSelect: false // Close upon selecting a date,
      });
      $("select").material_select();
      if (!Materialize == false) {
        Materialize.updateTextFields();
      }
    });
  }
});

// Additional missions go here! test = new Mission({});

// Breadcrumbs in Footer
window.navigationBreadcrumbs = document.getElementById("navigationBreadcrumbs");
window.showMissions = function() {
  missionsElement.innerHTML = missionCardsHTML;
  navigationBreadcrumbs.innerHTML = `
  <a class="pointer breadcrumb">Missions</a>
  `;
};

// Add HTML Mission Cards to the DOM
window.showMissions();


/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./img/tumlare.jpg?a0b7d3b21f32536b83f0e5192c541a22";

/***/ })

},[65]);