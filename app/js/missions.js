import { Timestamp } from "../../../../../AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/bson";

// Required for MongoDB database interfacing https://mongodb.github.io/stitch-js-sdk/Collection.html#updateOne
require("./app/js/stitch");

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
    image = require("../img/trail.jpg")
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
  image: require("../img/trail.jpg"),
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
  image: require("../img/tumlare.jpg")
});

// Additional missions go here! test = new Mission({});

// Add HTML Mission Cards to the DOM
missionsElement.innerHTML = missionCardsHTML;
