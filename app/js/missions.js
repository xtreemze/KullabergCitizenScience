// Required for MongoDB database interfacing https://mongodb.github.io/stitch-js-sdk/Collection.html#updateOne
require("./stitch");

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
    image = require("../img/trail.jpg")
  }) {
    this.shortName = shortName;
    this.title = title;
    this.description = description;
    this.image = image;
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
  title: "Trail Conditions",
  description: "Participate in monitoring trail conditions in Kullaberg.",
  image: require("../img/trail.jpg"),
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
  <form action="/app/js/stitch.js">
    <h4 class="col s12">${this.title}</h4>
    <h5 class="col s12">Georeference</h5>
    <p class="input-text col s12 m3">
      <label for="latitude">Latitude</label>
      <input id="latitude" type="text" value="${window.geoReference.lat}">
    </p>
    <p class="input-text col s12 m3">
      <label for="Longitude">Longitude</label>
      <input id="Longitude" type="text" value="${window.geoReference.long}">
    </p>
    <p class="input-text col s12 m3">
      <label for="Altitude">Altitude</label>
      <input id="Altitude" type="text" value="${window.geoReference.alt}">
    </p>
    <div class="input-field col s12 m3">
      <label class="" for="date">Date</label>
      <input id="date" type="text" class="datepicker" data-value="${window.Date.now()}">
    </div>
    <h5 class="col s12">Select All that Apply</h5>
    <p class="col s12 m4">
      <input id="rootsExposed" type="checkbox">
      <label for="rootsExposed">Roots Exposed</label>
    </p>
    <p class="col s12 m4">
      <input id="flooded" type="checkbox">
      <label for="flooded">Flooded</label>
    </p>
    <p class="col s12 m4">
      <input id="bifurcation" type="checkbox">
      <label for="bifurcation">Bifurcation - Widening</label>
    </p>
    <p class="col s12 m4">
      <input id="fallenTrees" type="checkbox">
      <label for="fallenTrees">Fallen Trees on Trail</label>
    </p>
    <p class="col s12 m4">
      <input id="slippery" type="checkbox">
      <label for="slippery">Slippery</label>
    </p>
    <p class="col s12 m4">
      <input id="stones" type="checkbox">
      <label for="stones">Sharp Stones</label>
    </p>
    <p class="col s12 m4">
      <input id="thorny" type="checkbox">
      <label for="thorny">Thorny Vegetation on the Edge</label>
    </p>
    <p class="col s12 m4">
      <input id="risk" type="checkbox">
      <label for="risk">Risk From Fallen Trees or Branches</label>
    </p>
    <p class="input-field col s12 m4">
      <select id="erosion">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <label for="erosion">Erosion</label>
    </p>
    <h5 class="col s12">Please Describe</h5>
    <p class="input-field col s12 m6">
      <textarea id="supportInfrastructure" class="materialize-textarea"></textarea>
      <label for="supportInfrastructure">Support Infrastructure: handrails, ropes, steps</label>
    </p>
    <p class="input-field col s12 m6">
      <textarea id="usePerception" class="materialize-textarea"></textarea>
      <label for="usePerception">
        Trail Usage: many people, conflicts betwen hikers, horses, bicycles</label>
    </p>
    <div class="file-field input-field col s12">
      <div class="btn blue darken-3 white-text">
        <span>Photos</span>
        <input type="file" multiple>
      </div>
      <div class="file-path-wrapper">
        <input accept="image/*" class="file-path validate" type="text" placeholder="Upload one or more photographs of the trail.">
      </div>
    </div>
    <button class="section col s12 btn btn-large waves-effect waves-light green darken-2 white-text" type="submit" name="action">Submit
      <i class="material-icons right">send</i>
    </button>
  </form>
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
  description:
    "Participate in monitoring porpoise whale activity around Kullaberg.",
  image: require("../img/tumlare.jpg"),
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
  <form action="/app/js/stitch.js">
    <h4 class="col s12">${this.title}</h4>
    <h5 class="col s12">Location of Sighting</h5>
    <p class="input-text col s12 m4">
      <label for="latitude">Latitude</label>
      <input id="latitude" type="text" value="${window.geoReference.lat}">
    </p>
    <p class="input-text col s12 m4">
      <label for="Longitude">Longitude</label>
      <input id="Longitude" type="text" value="${window.geoReference.long}">
    </p>

    <div class="input-field col s12 m4">
        <label class="" for="date">Date</label>
      <input id="date" type="text" class="datepicker" data-value="${window.Date.now()}">
    </div>
    <p class="input-text col s12 m8">
      <label for="species">Species</label>
      <input id="species" type="text" value="Porpoise">
    </p>
    <p class="col s12 m4">
        <input id="binocularsUsed" type="checkbox">
        <label for="binocularsUsed">Observation Made with Binoculars</label>
      </p>
      <h5 class="col s12">Quantity</h5>
    <p class="col s8 range-field">
      <input id="quantity" type="range" min="1" max="10">
      <label for="quantity">Quantity</label>
    </p>
    <p class="col s4">
      <input id="quantityUncertain" type="checkbox">
      <label for="quantityUncertain">Uncertain Quantity</label>
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
      <input id="otherBehavior" class="" type="text"></input>
      <label for="otherBehavior">Other Behavior (optional)</label>
    </p>
    <h5 class="col s12">Conditions</h5>
    <p class="input-field col s12 m6">
      <select id="oceanConditions">
        <option value="Sea Like a Mirror">Sea Like a Mirror</option>
        <option value="Very Calm / Ripples">Very Calm / Ripples</option>
        <option value="Small Wavelets">Small Wavelets</option>
        <option value="No Whitecaps / Small Waves">No Whitecaps / Small Waves</option>
        <option value="Few Whitecaps / Waves with Whitecaps">Few Whitecaps / Waves with Whitecaps</option>
      </select>
      <label for="oceanConditions">Appearance of the Ocean</label>
    </p>
    <p class="input-field col s12 m6">
      <select id="weather">
        <option value="Sunny">Sunny</option>
        <option value="Cloudy">Cloudy</option>
        <option value="Rainy">Rainy</option>
        <option value="Foggy">Foggy</option>
        <option value="Misty">Misty</option>
      </select>
      <label for="weather">Weather Conditions</label>
    </p>

    <h5 class="col s12">Comments</h5>
    <p class="input-field col s12">
      <textarea id="comments" class="materialize-textarea"></textarea>
      <label for="comments">Additional Comments (optional)</label>
    </p>
    <div class="file-field input-field col s12">
      <div class="btn blue darken-3 white-text">
        <span>Photos</span>
        <input type="file" multiple>
      </div>
      <div class="file-path-wrapper">
        <input accept="image/*" class="file-path validate" type="text" placeholder="Upload one or more photographs of the sighting.">
      </div>
    </div>
    <button class="section col s12 btn btn-large waves-effect waves-light green darken-2 white-text" type="submit" name="action">Submit
      <i class="material-icons right">send</i>
    </button>
  </form>
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
