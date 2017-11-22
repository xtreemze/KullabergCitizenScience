const stitch = require("mongodb-stitch");
const appId = "citizensciencestitch-oakmw";
const stitchClient = new stitch.StitchClient(appId);

// MongoDB Conect to citizenScience Database, M0 tier 512MB storage
const db = stitchClient
  .service("mongodb", "mongodb-atlas")
  .db("citizenScience");

// Anonymous Authentication
stitchClient
  .login()
  .then(() => {
    console.log("[MongoDB Stitch] Logged in as: " + stitchClient.authedId());
    M.toast({
      html: "Connected to Database",
      displayLength: 4000,
      classes: "green darken-2"
    });
  })
  .catch(e => {
    console.log("error: ", e);
    M.toast({
      html: "Database Unavailable",
      displayLength: 4000,
      classes: "yellow darken-2"
    });
  });

/**
 * Image Capture and Resizing Function
 *
 */
window.imageResize = function() {
  if (!window.Photos.files[0] === false) {
    // Create ObjectURL() to Show a thumbnail/preview
    window.img = document.createElement("img");
    img.src = window.URL.createObjectURL(window.Photos.files[0]);

    // Create Canvas
    var canvas = document.getElementById("photoDisplay");
    canvas.width = width || 800;
    canvas.height = height || 600;
    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);

    // Resize Image
    var MAX_WIDTH = 800;
    var MAX_HEIGHT = 600;
    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }

    var context = canvas.getContext("2d");
    context.drawImage(img, 0, 0, width, height);

    // Canvas to Data URL https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
    window.dataURL = canvas.toDataURL("image/jpeg", 0.4);
  }
};
/**
 * Upload FormData to MongoDB Database
 *
 * @param {string} [database=""]  Name of the Database Collection
 * @param {any} [set={}] The Data as an Object
 */
const updateDB = function(database = "", set = {}) {
  window.variables = {
    database: database,
    set: set
  };
  variables.set["owner_id"] = stitchClient.authedId();
  stitchClient
    .login()
    .then(() => db.collection(variables.database).insertOne(variables.set))
    .then(result => {
      console.log("[MongoDB Stitch] Updated: ", result);
      M.toast({
        html: "Database Updated",
        displayLength: 6000,
        classes: "green darken-2"
      });
    })
    .catch(error => {
      console.error("[MongoDB Stitch] Error: ", error);
      M.toast({
        html: "Unable to Connect",
        displayLength: 6000,
        classes: "red darken-2"
      });
    });
};

const queryDB = function(database = "", query = {}) {
  window.variables = {
    database: database,
    query: query,
    results: {}
  };
  stitchClient
    .login()
    .then(() =>
      db
        .collection(window.variables.database)
        .find({})
        .then(result => {
          window.variables.results = result;
          console.log("[MongoDB Stitch] Updated: ", result);
          M.toast({
            html: "Data Obtained ",
            displayLength: 6000,
            classes: "green darken-2"
          });
        })
    )
    .catch(error => {
      console.error("[MongoDB Stitch] Error: ", error);
      M.toast({
        html: "Unable to Connect",
        displayLength: 6000,
        classes: "red darken-2"
      });
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
  imageResize();
  window.form = parent.document.getElementsByTagName("form")[0];
  window.data = {
    location: {
      type: "Point",
      coordinates: []
    }
  };
  if (!window.dataURL === false) {
    window.data.Photo = window.dataURL;
  }
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
        window.data[elements[e].id] = {
          $date: new Date(elements[e].value)
        };
      } else if (elements[e].type == "number") {
        window.data[elements[e].id] = parseInt(elements[e].value, 10);
      } else if (elements[e].value.id === "Photos") {
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
  M.toast({
    html: congratulatoryMessage,
    displayLength: 8000,
    classes: "blue darken-2"
  });
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
    <div class="card">
      <div class="card-image">
        <img src="${this.image}">
        <span class="card-title">${this.title}</span>
      </div>
      <div class="card-content">
        <div>${this.description}</div>
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
    "Engage in the monitoring of Trail Conditions and participate in adaptive management by reporting incidents while walking in the trails system. Kullaberg Management will analyze measures to execute to resolve the reports.",
  image: require("../img/trail.jpg"),
  monitor: function() {
    let content = ``;
    navigator.geolocation.getCurrentPosition(position => {
      (window.geoReference = {
        lat: position.coords.latitude || 0,
        long: position.coords.longitude || 0,
        alt: position.coords.altitude || 0
      }),
        () => {
          console.log(
            "We are unable to locate your device. Please describe your location as best you can."
          );
          M.toast({
            html: "Position Unavailable",
            displayLength: 4000,
            classes: "red darken-2"
          });
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
  <form class="" onsubmit="return false">
    <h3 class="col s12">${this.title}</h3>
       <h5 class="col s12">Select All that Apply</h5>
    <p class="col s12 m4">
      <label>
        <input id="RootsExposed" type="checkbox">
        <span>Roots Exposed</span>
      </label>
    </p>
    <p class="col s12 m4">
      <label>
        <input id="Flooded" type="checkbox">
        <span>Flooded</span>
      </label>
    </p>
    <p class="col s12 m4">
      <label>
        <input id="Bifurcation" type="checkbox">
        <span>Bifurcation - Widening</span>
      </label>
    </p>
    <p class="col s12 m4">
      <label>
        <input id="FallenTrees" type="checkbox">
        <span>Fallen Trees on Trail</span>
      </label>
    </p>
    <p class="col s12 m4">
      <label>
        <input id="Slippery" type="checkbox">
        <span>Slippery</span>
      </label>
    </p>
    <p class="col s12 m4">
      <label>
        <input id="SharpStones" type="checkbox">
        <span>Sharp Stones</span>
      </label>
    </p>
    <p class="col s12 m4">
      <label>
        <input id="Thorns" type="checkbox">
        <span>Thorny Vegetation on the Edge</span>
      </label>
    </p>
    <p class="col s12 m4">
      <label>
        <input id="Risk" type="checkbox">
        <span>Risk From Fallen Trees or Branches</span>
      </label>
    </p>
    <div class="input-field col s12 m4">
      <select id="Erosion">
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <label for="Erosion">Erosion</label>
    </div>
    <h5 class="col s12">Please Describe</h5>
    <div class="divider"></div>
    <div class="section">
      <div class="input-field col s12 m6">
        <textarea id="SupportInfrastructure" class="materialize-textarea"></textarea>
        <label for="SupportInfrastructure">Support Infrastructure</label>
        <span class="helper-text">Example: handrails, ropes, steps.</span>
      </div>
      <div class="input-field col s12 m6">
        <textarea id="UsePerception" class="materialize-textarea"></textarea>
        <label for="UsePerception">
          Trail Usage</label>
        <span class="helper-text">Example: Many people, conflicts betwen hikers, horses, bicycles.</span>
      </div>
    </div>
    <h5 class="col s12">Georeference</h5>
    <div class="col s12"><div id="map"></div></div>
    <div class="input-field col s6 m3">
      <input id="Latitude" type="text" value="${window.geoReference.lat}">
      <label for="Latitude">Latitude</label>
    </div>
    <div class="input-field col s6 m3">
      <input id="Longitude" type="text" value="${window.geoReference.long}">
      <label for="Longitude">Longitude</label>
    </div>
    <div class="input-field col s6 m2">
      <input id="Altitude" type="text" value="${window.geoReference.alt}">
      <label for="Altitude">Altitude</label>
    </div>
    <div class="col s6 m4">
      <label for="Date">Date</label>
      <input id="Day" type="text" class="datepicker" value="${new Date().toDateString()}">
    </div>
    <div class="file-field input-field col s12">
      <div class="btn">
        <span>Photos</span>
        <input id="Photos" accept="image/*;capture=camera" type="file" multiple>
      </div>
      <div class="file-path-wrapper">
        <input accept="image/*" class="file-path validate" type="text" placeholder="Upload one or more photos of the trail.">
      </div>
    </div>
    <canvas id="photoDisplay" width="800" height="600"></canvas>
    <button class="col s12 btn btn-large waves-effect waves-light" type="submit" onclick="collectInputs('${
      this.databaseCollection
    }', '${this.congratulatoryMessage}')">Submit
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
      window.scrollTo(0, 0);

      const map = L.map("map").setView(
        [window.Latitude.value, window.Longitude.value],
        13
      );

      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        // attribution:
        //   '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      let circle = L.circle([window.Latitude.value, window.Longitude.value], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 5
      })
        .addTo(map)
        .bindPopup("Your Location")
        .openPopup();

      setTimeout(function() {
        M.updateTextFields();
        let multiSelect = document.querySelectorAll("select");
        for (const element in multiSelect) {
          if (multiSelect.hasOwnProperty(element)) {
            const newInstance = new M.Select(multiSelect[element]);
          }
        }
        let datePicker = document.querySelectorAll(".datepicker");
        for (const element in datePicker) {
          if (datePicker.hasOwnProperty(element)) {
            const datePickerInstance = new M.Datepicker(datePicker[element], {
              // container: ".datepicker",
              setDefaultDate: true,
              // format: "mmm-dd-yyyy",
              defaultDate: new Date().toDateString(),
              yearRange: 2
            });
          }
        }

        // datePickerInstance.setDate(new Date());
      }, 80);
    });
  },
  //
  /**
   * Function to retrieve display Database Results
   *
   */
  analyze: function() {
    let content = ``;
    queryDB("TrailCondition", {});

    content += `<div class="row">
  <div class="">
    <h3 class="col s12">${this.title}</h3>
    <h5 class="col s12">Database Results</h5>
    <div class="col s12"><div id="map"></div><div>
    `;
    if (variables.results.length > 0) {
      for (const iterator of variables.results) {
        content += `<p>${iterator}</p>`;
      }
    }

    content += `
  </div>
</div>
`;
    missionsElement.innerHTML = content;
    navigationBreadcrumbs.innerHTML = `
<a onclick="showMissions()" class="pointer breadcrumb">${this.title}</a>
<a class="pointer breadcrumb">Analyze</a>
`;
    window.scrollTo(0, 0);
    navigator.geolocation.getCurrentPosition(position => {
      (window.geoReference = {
        lat: position.coords.latitude || 0,
        long: position.coords.longitude || 0,
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

      const map = L.map("map").setView(
        [geoReference.lat, geoReference.long],
        12
      );

      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        // attribution:
        //   '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      let circle = L.circle([geoReference.lat, geoReference.long], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 5
      })
        .addTo(map)
        .bindPopup("Your Location")
        .openPopup();
      M.updateTextFields();
    });
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
        lat: position.coords.latitude || 0,
        long: position.coords.longitude || 0,
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
  <form class="" onsubmit="return false">
    <h3 class="col s12">${this.title}</h3>
    <div class="input-field col m4 s12">
    <label for="Species">Species</label>
    <input id="Species" type="text" value="Porpoise">
  </div>
  <p class="col s6 m4">
  <label>
  <input id="BinocularsUsed" type="checkbox">
  <span>Observation Made with Binoculars</span>
  </label>
  </p>
  <p class="col s6 m4">
  <label>
  <input id="UncertainQuantity" type="checkbox">
  <span>Uncertain Quantity</span>
  </label>
  </p>
  <div class="col s10 range-field">
  <label>Quantity</label>
  <input id="Quantity" type="range" min="1" max="20" value="10">
  </div>
  <p class="col s2">
  <span id="QuantityDisplay" class="helper-text">10</span>
  </p>
    <h5 class="col s12">Location of Sighting</h5>
    <div class="input-field col s6 m4">
      <input id="Latitude" type="text" value="${window.geoReference.lat}">
      <label for="Latitude">Latitude</label>
    </div>
    <div class="input-field col s6 m4">
    <input id="Longitude" type="text" value="${window.geoReference.long}">
    <label for="Longitude">Longitude</label>
    </div>
    <div class="input-field col s6 m4">
    <label class="" for="Date">Date</label>
    <input id="Day" type="text" class="datepicker" value="${new Date().toDateString()}">
    </div>
    <p class="col s12">Locate the sighting on the map.</p>
    <div class ="col s12"><div id="map"></div><div>
    <div class="col s10 range-field">
      <label>Area of Observation</label>
      <input id="ObservationArea" type="range" min="1" max="200" value="20">
    </div>
    <p class="col s2">
      <span id="ObservationAreaDisplay" class="helper-text">20</span> <span class="meters">m</span>
    </p>


    <h5 class="col s12">Behavior</h5>
    <div class="input-field col s12 m6">
      <select id="Behavior">
        <option selected value="Constant Heading, Regular Diving">Constant Heading, Regular Diving</option>
        <option value="Varied Heading, Irregular Diving">Varied Heading, Irregular Diving</option>
        <option value="Slow Movement, Long Time at Surface">Slow Movement, Long Time at Surface</option>
        <option value="Jumping">Jumping</option>
        <option value="Found Dead / Injured">Found Dead / Injured</option>
      </select>
      <label for="Behavior">Behavior</label>
    </div>
    <div class="input-field col s12 m6">
      <input id="OtherBehavior" class="" type="text"></input>
      <label for="OtherBehavior">Other Behavior</label>
      <span class="helper-text">(optional)</span>
    </div>
    <h5 class="col s12">Conditions</h5>
    <div class="input-field col s12 m6">
      <select id="OceanConditions">
        <option selected value="Sea Like a Mirror">Sea Like a Mirror</option>
        <option value="Very Calm / Ripples">Very Calm / Ripples</option>
        <option value="Small Wavelets">Small Wavelets</option>
        <option value="No Whitecaps / Small Waves">No Whitecaps / Small Waves</option>
        <option value="Few Whitecaps / Waves with Whitecaps">Few Whitecaps / Waves with Whitecaps</option>
      </select>
      <label for="OceanConditions">Appearance of the Ocean</label>
    </div>
    <div class="input-field col s12 m6">
      <select id="Weather">
        <option selected value="Sunny">Sunny</option>
        <option value="Cloudy">Cloudy</option>
        <option value="Rainy">Rainy</option>
        <option value="Foggy">Foggy</option>
        <option value="Misty">Misty</option>
      </select>
      <label for="Weather">Weather Conditions</label>
    </div>
    <h5 class="col s12">Comments</h5>
   
      <div class="input-field col s12">
        <textarea id="Comments" class="materialize-textarea"></textarea>
        <label for="Comments">Additional Comments</label>
        <span class="helper-text">(optional)</span>
      </div>
    
    <div class="file-field input-field col s12">
      <div class="btn ">
        <span>Photos</span>
        <input id="Photos" accept="image/*;capture=camera" type="file" multiple>
      </div>
      <div class="file-path-wrapper">
        <input class="file-path validate" type="text" placeholder="Upload one or more photographs of the sighting.">
      </div>
    </div>
    <canvas id="photoDisplay" width="800" height="600"></canvas>
    <button class="section col s12 btn btn-large waves-effect waves-light" type="submit" onClick="window.collectInputs('${
      this.databaseCollection
    }', '${this.congratulatoryMessage}')">Submit
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
      window.scrollTo(0, 0);

      const map = L.map("map").setView(
        [window.Latitude.value, window.Longitude.value],
        13
      );

      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        // attribution:
        //   '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      let circle = L.circle([window.Latitude.value, window.Longitude.value], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 5
      })
        .addTo(map)
        .bindPopup("Your Location")
        .openPopup();
      let popup = L.popup();
      window.radius = L.circle(
        [window.Latitude.value, window.Longitude.value],
        {
          color: "#0288d1",
          fillColor: "#0d47a1",
          fillOpacity: 0.5,
          radius: 20
        }
      ).addTo(map);

      function onMapClick(e) {
        window.Latitude.value = e.latlng.lat;
        window.Longitude.value = e.latlng.lng;
        radius.setLatLng(e.latlng);
        popup
          .setLatLng(e.latlng)
          .setContent(window.Species.value)
          .openOn(map);
      }

      map.on("click", onMapClick);

      M.updateTextFields();
      let multiSelect = document.querySelectorAll("select");
      for (const element in multiSelect) {
        if (multiSelect.hasOwnProperty(element)) {
          const newInstance = new M.Select(multiSelect[element]);
        }
      }
      let datePicker = document.querySelectorAll(".datepicker");
      for (const element in datePicker) {
        if (datePicker.hasOwnProperty(element)) {
          const datePickerInstance = new M.Datepicker(datePicker[element], {
            setDefaultDate: true,
            format: "mmm-dd-yyyy",
            defaultDate: new Date("mmm-dd-yyyy"),
            yearRange: 2
          });
        }
      }
      let observationArea = document.getElementById("ObservationArea");
      let observationAreaDisplay = document.getElementById(
        "ObservationAreaDisplay"
      );
      observationArea.addEventListener(
        "mousemove",
        function() {
          observationAreaDisplay.innerHTML = observationArea.value;
          radius.setRadius(observationArea.value);
        },
        { passive: true }
      );
      observationArea.addEventListener(
        "touchmove",
        function() {
          observationAreaDisplay.innerHTML = observationArea.value;
          radius.setRadius(observationArea.value);
        },
        { passive: true }
      );
      observationArea.addEventListener(
        "change",
        function() {
          observationAreaDisplay.innerHTML = observationArea.value;
          radius.setRadius(observationArea.value);
        },
        { passive: true }
      );
      let number = document.getElementById("Quantity");
      let display = document.getElementById("QuantityDisplay");
      number.addEventListener(
        "mousemove",
        function() {
          display.innerHTML = number.value;
        },
        { passive: true }
      );
      number.addEventListener(
        "touchmove",
        function() {
          display.innerHTML = number.value;
        },
        { passive: true }
      );
      number.addEventListener(
        "change",
        function() {
          display.innerHTML = number.value;
        },
        { passive: true }
      );
      // datePickerInstance.setDate(new Date());
    });
  },
  analyze: function() {
    let content = ``;

    content += `<div class="row">
  <div class="">
    <h3 class="col s12">${this.title}</h3>
    <h5 class="col s12">Database Results</h5>
    <div class="col s12"><div id="map"></div><div>    
  </div>
</div>
`;
    missionsElement.innerHTML = content;
    navigationBreadcrumbs.innerHTML = `

<a onclick="showMissions()" class="pointer breadcrumb">${this.title}</a>
<a class="pointer breadcrumb">Analyze</a>
`;
    window.scrollTo(0, 0);
    navigator.geolocation.getCurrentPosition(position => {
      (window.geoReference = {
        lat: position.coords.latitude || 0,
        long: position.coords.longitude || 0,
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

      const map = L.map("map").setView(
        [geoReference.lat, geoReference.long],
        12
      );

      L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
        // attribution:
        //   '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      let circle = L.circle([geoReference.lat, geoReference.long], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 5
      })
        .addTo(map)
        .bindPopup("Your Location")
        .openPopup();
      M.updateTextFields();
    });
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
  window.scrollTo(0, 0);
};
