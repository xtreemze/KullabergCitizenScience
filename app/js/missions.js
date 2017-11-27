const stitch = require("mongodb-stitch");

const client = new stitch.StitchClient("citizensciencestitch-oakmw");
const db = client.service("mongodb", "mongodb-atlas").db("citizenScience");
require("./../../node_modules/blueimp-load-image/js/load-image.all.min.js");

window.enableBox = function() {
  let elem = document.querySelector(".materialboxed");
  instance = new M.Materialbox(elem);
};

const updateDB = function(database = "", dataset = {}) {
  const datasetContent = dataset;
  datasetContent["owner_id"] = client.authedId();
  client
    .login()
    .then(() => db.collection(database).insertOne(datasetContent))
    .then(result => {
      console.log("[MongoDB Stitch] Updated: ", result, dataset);
      M.toast({
        html: "Database Updated",
        displayLength: 1000,
        classes: "green darken-2"
      });
    })
    .catch(error => {
      console.error("[MongoDB Stitch] Error: ", error);
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
    Location: {
      type: "Point",
      coordinates: []
    }
    // , Status: "Reported"
  };
  if (!window.dataURL === false) {
    window.data.Photo = window.dataURL;
  }
  window.elements = form.elements;
  for (e = 0; e < elements.length; e++) {
    if (
      elements[e].id === "Photos" ||
      elements[e].id === "photoFilePath" ||
      elements[e].id.length < 1
    ) {
      console.warn("[Form1] Excluded: ", elements[e]);
    } else if (elements[e].value.id === "Date") {
      window.data[elements[e].id] = {
        $date: new Date(elements[e].value)
      };
    } else if (elements[e].id === "Longitude") {
      window.data.Location.coordinates[0] = {
        $numberDecimal: elements[e].value
      };
    } else if (elements[e].id === "Latitude") {
      window.data.Location.coordinates[1] = {
        $numberDecimal: elements[e].value
      };
    } else if (elements[e].id === "Altitude") {
      window.data.Location.coordinates[2] = {
        $numberDecimal: elements[e].value
      };
    } else if (elements[e].type == "checkbox") {
      window.data[elements[e].id] = elements[e].checked;
    } else if (elements[e].type == "number") {
      window.data[elements[e].id] = parseInt(elements[e].value, 10);
    } else if (elements[e].value.length > 0) {
      window.data[elements[e].id] = elements[e].value;
    } else {
      console.warn("[Form2] Excluded: ", elements[e]);
    }
  }

  updateDB(databaseCollection, window.data);
  window.showMissions();

  // Congratulatory Message
  M.toast({
    html: congratulatoryMessage,
    displayLength: 4000,
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
    image = require("../img/trail.jpg"),
    monitorSuccess,
    analyzeSuccess,
    queryDB
  }) {
    this.shortName = shortName;
    this.title = title;
    this.description = description;
    this.image = image;
    this.databaseCollection = databaseCollection;
    this.congratulatoryMessage = congratulatoryMessage;
    this.monitorSuccess = monitorSuccess;
    this.analyzeSuccess = analyzeSuccess;
    this.queryDB = function(database = this.databaseCollection, query) {
      M.toast({
        html: "Connecting...",
        displayLength: 1000,
        classes: "green darken-2"
      });
      missions.innerHTML = `
      <div class="fullscreen" id="map2"></div>
      `;

      navigationBreadcrumbs.innerHTML = `
      <a onclick="showMissions()" class="pointer breadcrumb">${this.title}</a>
        <a class="pointer breadcrumb">Analyze</a>
        `;
      // let resultContent = "";

      window.scrollTo(0, 0);
      window.map = L.map("map2", {
        tapTolerance: 30,
        zoomControl: false
      })
        .fitWorld()
        .setZoom(2);

      var OSMMapnik = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }
      ).addTo(map);
      // L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {}).addTo(map);

      const geoJSONTrails = require("./trails.json");

      window.mappedTrails = L.geoJSON(geoJSONTrails, {
        style: function(feature) {
          return {
            color: feature.properties.stroke,
            opacity: 0.6,
            dashArray: [7, 5]
          };
          // stroke-opacity: feature.properties.stroke-opacity,
          // stroke-width: feature.properties.stroke-width}
        }
      });

      // Get information from Database
      client
        .login()
        .then(
          () => db.collection(database).find(query)
          // .limit(100)
          // .execute()
        )
        .then(docs => {
          let queryDBResult = docs;
          console.log("[MongoDB Stitch] Connected to Stitch");
          console.log("[MongoDB Stitch] Found: ", queryDBResult);
          M.toast({
            html: "Data Obtained ",
            displayLength: 1000,
            classes: "green darken-2"
          });
          this.analyze(queryDBResult);
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
    this.monitor = function() {
      navigator.geolocation.getCurrentPosition(
        position => {
          window.geoReference = {
            lat: position.coords.latitude || 0,
            long: position.coords.longitude || 0,
            alt: position.coords.altitude || 0,
            accuracy: position.coords.accuracy || 0
          };
          this.monitorSuccess();

          navigationBreadcrumbs.innerHTML = `
          <a onclick="showMissions()" class="pointer breadcrumb">${this
            .title}</a>
          <a class="pointer breadcrumb">Monitor</a>
          `;
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
          window.scrollTo(0, 0);
          // Resize, Load and Orient Photo
          document.getElementById("Photos").onchange = function(e) {
            console.log("Image loaded");
            loadImage(
              e.target.files[0],
              function(img) {
                let canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                window.dataURL = canvas.toDataURL("image/jpeg", 0.5);
                console.log("[Image Resizer]", canvas);
              },
              {
                maxWidth: 512,
                orientation: true
              }
            );
          };
        },
        error => {
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
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 30000
        }
      );
    };
    this.analyze = function(queryDBResult) {
      const geoJSONPoints = [];
      // if (!resultContent) {
      //   let resultContent = "";
      // } else {
      //   resultContent = "";
      // }

      for (let i = queryDBResult.length - 1; i > 0; i--) {
        let dbResponse = `<span>${queryDBResult[i].Date}</span><br>`;
        for (const key in queryDBResult[i]) {
          // For simplicity, do not show these database results:
          if (
            key === "_id" ||
            key === "owner_id" ||
            key === "Date" ||
            key === "Location" ||
            key === "Photo" ||
            key === "photoFilePath" ||
            key === "Photos" ||
            key === "Status" ||
            queryDBResult[i][key] === false ||
            queryDBResult[i][key] === "Low"
          ) {
          } else {
            // Format for displaying information in map popups
            dbResponse += `<span class="strong">${key}: </span><span>${queryDBResult[
              i
            ][key]}</span><br>`;
          }
        }

        queryDBResult[i].Location.properties = {
          description: dbResponse,
          photo: `<img class="responsive-img materialboxed" data-caption="${queryDBResult[
            i
          ]
            .Date}" onload="enableBox()" onclick="enableBox()" src="${queryDBResult[
            i
          ].Photo}">          
              `,
          radius: queryDBResult[i].ObservationArea
        };
        if (!queryDBResult[i].ObservationArea) {
          // Size of map marker for missions other than Tumalre
          queryDBResult[i].Location.properties.radius = 16;
        }
        geoJSONPoints.push(queryDBResult[i].Location);
      }

      let trails = {
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 16,
            fillColor: "#ff7800",
            color: "yellow",
            weight: 4,
            opacity: 1,
            fillOpacity: 0.7
          }).bindPopup(`${feature.properties.description}<br>
              ${feature.properties.photo}`);
        }
        // onEachFeature: function() {
        //   // var elem = document.querySelector(".materialboxed");
        //   // var instance = new M.Materialbox(elem);
        // }
      };
      let tumlare = {
        pointToLayer: function(feature, latlng) {
          return L.circle(latlng, {
            // radius: 5,
            fillColor: "#ff7800",
            color: "yellow",
            weight: 4,
            opacity: 1,
            fillOpacity: 0.7,
            radius: feature.properties.radius
          }).bindPopup(`${feature.properties.description}<br>
              ${feature.properties.photo}`);
        }
        // onEachFeature: function() {
        //   // var elem = document.querySelector(".materialboxed");
        //   // var instance = new M.Materialbox(elem);
        // }
      };
      let options = {};
      if (!queryDBResult[0].ObservationArea === false) {
        options = tumlare;
      } else {
        options = trails;
      }
      // Passing all points to cluster marker with the above mission display options
      let reports = L.geoJSON(geoJSONPoints, options);

      var markers = L.markerClusterGroup({});
      // https://github.com/Leaflet/Leaflet.markercluster
      markers.addLayer(reports);

      map.addLayer(markers);
      // M.updateTextFields();
      setTimeout(() => {
        map.flyToBounds(window.mappedTrails.getBounds(), { padding: [82, 82] });
      }, 3000);
      setTimeout(() => {
        mappedTrails.addTo(map);
      }, 6500);
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
        <a class="pointer" onclick="${this.shortName}.queryDB()">Analyze</a>
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

/**
 * Show the Missions in Front Page
 *
 */
window.showMissions = function() {
  loading.classList.remove("fadeOut");
  loading.classList.add("fadeIn");
  missions.innerHTML = "";
  setTimeout(() => {
    window.scrollTo(0, 0);
    missions.innerHTML = missionCardsHTML;
    navigationBreadcrumbs.innerHTML = `
    <a class="pointer breadcrumb">Missions</a>
    `;
    setTimeout(() => {
      loading.classList.remove("fadeIn");
      loading.classList.add("fadeOut");
    }, 290);
  }, 290);
};

window.addEventListener("DOMContentLoaded", function() {
  // Add HTML Mission Cards to the DOM
  missions.innerHTML = missionCardsHTML;
  navigationBreadcrumbs.innerHTML = `
  <a class="pointer breadcrumb">Missions</a>
  `;
  window.scrollTo(0, 0);
  setTimeout(() => {
    loading.classList.add("fadeOut");
  }, 10);
});

// Additional missions go in separate files and require this file. Add them to ./../entry.js
// test = new Mission({});
module.exports = Mission;
