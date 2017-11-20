const stitch = require("mongodb-stitch");
const appId = "citizensciencestitch-oakmw";
const stitchClient = new stitch.StitchClient(appId);

// MongoDB Conect to citizenScience Database, M0 tier 512MB storage
const db = stitchClient
  .service("mongodb", "mongodb-atlas")
  .db("citizenScience");

/**
 * Function to Upload data to DB
 * 
 * @param {any} Database collection 
 * @param {any} Dataset from the Form
 */
const updateDB = function(database, set) {
  window.variables = {
    database: database,
    set: set
  };
  variables.set["owner_id"] = stitchClient.authedId();
  stitchClient
    .login()
    .then(() => db.collection(variables.database).insertOne(variables.set))
    .then(result => {
      console.log("[MongoDB Stitch] Updated: ", result),
        Materialize.toast(
          "Database Updated",
          8000,
          "green darken-2"
        );
    })
    .catch(error => {
      console.error("[MongoDB Stitch] Error: ", error),
        Materialize.toast("Unable to Connect", 8000, "red darken-2");
    });
};
/**
 *  Function to Collect Data, send to Database and Congratulate User
 * 
 * @param {any} Database Collection 
 * @param {string} A Congratulatory Message 
 */
window.collectInputs = function(
  databaseCollection = {},
  congratulatoryMessage = ""
) {
  window.form = parent.document.getElementsByTagName("form")[0];
  window.data = {
    location: {
      type: "Point",
      coordinates: []
    }
  };
  window.elements = form.elements;
  for (e = 0; e < elements.length; e++) {
    if (elements[e].id.length > 0) {
      if (elements[e].type == "checkbox") {
        window.data[elements[e].id] = elements[e].checked;
      } else if (elements[e].id === "Longitude") {
        window.data.location.coordinates[0] = {
          $numberDecimal: elements[e].value
        };
      } else if (elements[e].id === "Latitude") {
        window.data.location.coordinates[1] = {
          $numberDecimal: elements[e].value
        };
      } else if (elements[e].id === "Altitude") {
        window.data.location.coordinates[2] = {
          $numberDecimal: elements[e].value
        };
      } else if (elements[e].value.id === "Date") {
        window.data[elements[e].id] = { $date: new Date(elements[e].value) };
      } else if (elements[e].type == "number") {
        window.data[elements[e].id] = parseInt(elements[e].value, 10);
      } else if (elements[e].value.length > 0) {
        window.data[elements[e].id] = elements[e].value;
      } else {
        console.warn("[Form] Did not include: " + elements[e].id);
      }
    }
  }

  updateDB(databaseCollection, window.data);

  setTimeout(() => {
    window.showMissions();
  }, 4000);
  // Congratulatory Message
  Materialize.toast(congratulatoryMessage, 8000, "blue darken-2");
};

// Empty variable to gather and hold html for mission cards in memory
let missionCardsHTML = ``;

// Empty variable to gather and hold geographical references
window.geoReference = {};

// The DOM element that holds the mission cards
const missionsElement = document.getElementById("missions");
window.missionsElement = missionsElement;
// missionsElement.innerHTML += `<h5 class=" ">Choose Your Mission</h3>`;

// Collecting all Missions in a Set
let Missions = new Set();

class Mission {
  constructor({
    shortName = "shortName",
    title = "Title",
    description = "Description",
    // Each Mission should specify its collection in the MongoDB database
    databaseCollection = "mongoDbCollection",
    congratulatoryMessage = "Congratulations!",
    // Data for form submission
    monitor = ``,
    // Data retrieval and display
    analyze = ``,
    // Each mission should have a representative image
    image = require("../img/trail.jpg")
  }) {
    this.shortName = shortName;
    this.title = title;
    this.description = description;
    this.image = image;
    this.databaseCollection = databaseCollection;
    this.congratulatoryMessage = congratulatoryMessage;
    this.monitor = monitor;
    this.analyze = analyze;
    // Displays on Front Page
    this.card = `<div class="cardContainer" id="${this.title}">
  <div class="col s12 m6 l6">
    <div class="card large">
      <div class="card-image">
        <img src="${this.image}">
        <span class="card-title">${this.title}</span>
      </div>
      <div class="card-content">
        <p>${this.description}</p>
      </div>
      <div class="card-action">
        <a class="pointer" onclick="${this.shortName}.monitor()">Monitor</a>
        <a class="pointer" onclick="${this.shortName}.analyze()">Analyze</a>
      </div>
    </div>
  </div>
</div>
`;
    Missions.add(this);
    // Add Mission Cards to DOM
    missionCardsHTML += this.card;
  }
}

// Create the Missions
trails = new Mission({
  shortName: "trails",
  title: "Trail Condition",
  databaseCollection: "TrailCondition",
  congratulatoryMessage: "Thanks for completing the Trail Conditions Mission!",
  description:
    "Engage in the monitoring of Trail Conditions and participate in adaptive management by reporting incidents while walking in the trails system. The Kullaberg Management Team will analyze measures to execute to resolve the incidents you report.",
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
  <form class="container" onsubmit="return false">
    <h4 class="col s12">${this.title}</h4>
    <h5 class="col s12">Georeference</h5>
    <p class="input-text col s6 m3">
      <label for="Latitude">Latitude</label>
      <input id="Latitude" type="number" value="${window.geoReference.lat}">
    </p>
    <p class="input-text col s6 m3">
      <label for="Longitude">Longitude</label>
      <input id="Longitude" type="number" value="${window.geoReference.long}">
    </p>
    <p class="input-text col s6 m2">
      <label for="Altitude">Altitude</label>
      <input id="Altitude" type="number" value="${window.geoReference.alt}">
    </p>
    <div class="input-field col s6 m4">
      <label class="" for="Date">Date</label>
      <input id="Date" type="date" class="datepicker" data-value="${window.Date.now()}">
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
      <div class="btn ">
        <span>Photos</span>
        <input id="Photos" accept="image/*;capture=camera" type="file" multiple>
      </div>
      <div class="file-path-wrapper">
        <input accept="image/*" class="file-path validate" type="text" placeholder="Upload one or more photos of the trail.">
      </div>
    </div>
    <div class="section col s12 btn btn-large waves-effect waves-light  " type="submit" onClick="collectInputs('${this
      .databaseCollection}', '${this.congratulatoryMessage}')">Submit
      <i class="material-icons right">send</i>
    </div>
  </form>
</div>
`;
      missionsElement.innerHTML = content;
      navigationBreadcrumbs.innerHTML = `

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
  },
  //
  /**
   * Function to retrieve display Database Results
   * 
   */
  analyze: function() {
    let content = ``;

    content += `<div class="row">
  <div class="container">
    <h4 class="col s12">${this.title}</h4>
    <h5 class="col s12">Database Results</h5>
  </div>
</div>
`;
    missionsElement.innerHTML = content;
    navigationBreadcrumbs.innerHTML = `
<a onclick="showMissions()" class="pointer breadcrumb">${this.title}</a>
<a class="pointer breadcrumb">Analyze</a>
`;

    if (!Materialize == false) {
      Materialize.updateTextFields();
    }
  }
});

tumlare = new Mission({
  shortName: "tumlare",
  title: "Porpoise Observation",
  databaseCollection: "Tumlare",
  congratulatoryMessage:
    "Thank you for your participation! Your contribution helps us to develop an adaptive management in the Kullaberg Nature.",
  description:
    "Engage in the collection of visual harbor porpoise observations (both living and dead) in the north-western parts of Scania. Observations are used in scientific research to help increase the knowledge about this threatened species.",
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
  <form class="container" onsubmit="return false">
    <h4 class="col s12">${this.title}</h4>
    <h5 class="col s12">Location of Sighting</h5>
    <p class="input-text col s6 m4">
      <label for="Latitude">Latitude</label>
      <input id="Latitude" type="number" value="${window.geoReference.lat}">
    </p>
    <p class="input-text col s6 m4">
      <label for="Longitude">Longitude</label>
      <input id="Longitude" type="number" value="${window.geoReference.long}">
    </p>
    <div class="input-field col s6 m4">
      <label class="" for="Date">Date</label>
      <input id="Date" type="date" class="datepicker" data-value="${window.Date.now()}">
    </div>
    <p class="col s6 m4">
      <input id="Binoculars Used" type="checkbox">
      <label for="Binoculars Used">Observation Made with Binoculars</label>
    </p>
    <p class="input-text col s12 m8">
      <label for="Species">Species</label>
      <input id="Species" type="text" value="Porpoise">
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
      <select id="Behavior">
        <option value="Constant Heading, Regular Diving">Constant Heading, Regular Diving</option>
        <option value="Varied Heading, Irregular Diving">Varied Heading, Irregular Diving</option>
        <option value="Slow Movement, Long Time at Surface">Slow Movement, Long Time at Surface</option>
        <option value="Jumping">Jumping</option>
        <option value="Found Dead / Injured">Found Dead / Injured</option>
      </select>
      <label for="Behavior">Behavior</label>
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
      <div class="btn ">
        <span>Photos</span>
        <input id="Photos" accept="image/*;capture=camera" type="file" multiple>
      </div>
      <div class="file-path-wrapper">
        <input class="file-path validate" type="text" placeholder="Upload one or more photographs of the sighting.">
      </div>
    </div>
    <button class="section col s12 btn btn-large waves-effect waves-light  " type="submit" onClick="window.collectInputs('${this
      .databaseCollection}', '${this.congratulatoryMessage}')">Submit
      <i class="material-icons right">send</i>
    </button>
  </form>
</div>
`;
      missionsElement.innerHTML = content;
      navigationBreadcrumbs.innerHTML = `
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
  },
  analyze: function() {
    let content = ``;

    content += `<div class="row">
  <div class="container">
    <h4 class="col s12">${this.title}</h4>
    <h5 class="col s12">Database Results</h5>
  </div>
</div>
`;
    missionsElement.innerHTML = content;
    navigationBreadcrumbs.innerHTML = `

<a onclick="showMissions()" class="pointer breadcrumb">${this.title}</a>
<a class="pointer breadcrumb">Analyze</a>
`;

    if (!Materialize == false) {
      Materialize.updateTextFields();
    }
  }
});

// Additional missions go here! test = new Mission({});

// Breadcrumbs in Footer
window.navigationBreadcrumbs = document.getElementById("navigationBreadcrumbs");

/**
 * Show the Missions in Front Page
 * 
 */
window.showMissions = function() {
  missionsElement.innerHTML = missionCardsHTML;
  navigationBreadcrumbs.innerHTML = `
  <a class="pointer breadcrumb">Missions</a>
  `;
};
