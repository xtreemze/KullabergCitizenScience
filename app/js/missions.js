const stitch = require("mongodb-stitch");

const client = new stitch.StitchClient("citizensciencestitch-oakmw");
const db = client.service("mongodb", "mongodb-atlas").db("citizenScience");

/**
 * Query DB and if Succesful, display results in a list and launches the analyze function for the mission
 * 
 * @param {any} database 
 * @param {any} query 
 * @param {any} mission 
 */
window.queryDB = function(database, query, mission) {
  M.toast({
    html: "Connecting...",
    displayLength: 4000,
    classes: "green darken-2"
  });
  client
    .login()
    .then(
      () => db.collection(database).find(query)
      // .limit(100)
      // .execute()
    )
    .then(docs => {
      this.queryDBResult = docs;
      console.log("[MongoDB Stitch] Connected to Stitch");
      console.log("[MongoDB Stitch] Found: ", queryDBResult);
      M.toast({
        html: "Data Obtained ",
        displayLength: 4000,
        classes: "green darken-2"
      });
      mission.analyze(queryDBResult);
    })
    .catch(err => {
      console.error(err);
      M.toast({
        html: "Unable to Connect",
        displayLength: 4000,
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
module.exports = missionsElement;
// window.missionsElement = missionsElement;
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

    /**
     * Image Capture and Resizing Function
     *
     */
    const imageResize = function() {
      if (!window.Photos.files[0] === false) {
        // Create ObjectURL() to Show a thumbnail/preview
        window.img = document.createElement("img");
        img.src = window.URL.createObjectURL(window.Photos.files[0]);

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
        // Create Canvas
        var canvas = document.getElementById("photoDisplay");
        canvas.width = width || 800;
        canvas.height = height || 600;
        var context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, width, height);

        // Canvas to Data URL https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
        window.dataURL = canvas.toDataURL("image/jpeg", 0.2);
      }
    };
    /**
     * Takes a blob from the Database and decodes into an image
     * 
     * @param {string} Blob
     */
    const decodeImage = function(blob = "") {
      const image = document.createElement("img");
      // image.src = "data:image/jpeg;base64," + Base64.encode(blob);
      image.src = Base64.encode(blob);
      document.body.appendChild(image);
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
      variables.set["owner_id"] = client.authedId();
      client
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
        <a class="pointer" onclick="queryDB('${this
          .databaseCollection}', {}, ${this.shortName})">Analyze</a>
      </div>
    </div>
  </div>
</div>
`;
    this.collectionItem = function({
      src = "",
      title = "",
      content = "",
      icon = ""
    }) {
      `<li class="collection-item avatar">
<img src="${src}" alt="${title}" class="circle">
<span class="title">${title}</span>
${content}
<a href="#!" class="secondary-content"><i class="material-icons">${icon}</i></a>
</li>`;
    };
    Missions.add(this);
    // Add Mission Cards to DOM
    missionCardsHTML += this.card;
  }
}

// Additional missions go in separate files and require this file. Add them to ./../entry.js
// test = new Mission({});

// Breadcrumbs in Footer
window.navigationBreadcrumbs = document.getElementById("navigationBreadcrumbs");

/**
 * Show the Missions in Front Page
 *
 */
window.showMissions = function() {
  missions.innerHTML = missionCardsHTML;
  navigationBreadcrumbs.innerHTML = `
  <a class="pointer breadcrumb">Missions</a>
  `;
  window.scrollTo(0, 0);
};

module.exports = Mission;
