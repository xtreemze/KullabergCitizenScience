"use strict";
const Mission = require("./missions");
// const M = require("materialize-css");
const L = require("leaflet");
// import L from "leaflet";
// import Mission from "./missions";
const trails = new Mission({
  shortName: "trails",
  title: "Trail Condition",
  databaseCollection: "TrailCondition",
  congratulatoryMessage: "Thanks for your help!",
  description:
    "Engage in the monitoring of Trail Conditions and participate in adaptive management by reporting incidents while walking in the trails system. Kullaberg Management will analyze measures to execute to resolve the reports.",
  image: require("../img/trail.jpg"),
  monitorSuccess: function() {
    let content = ``;
    content += `<div class="row">
  <form class="" onsubmit="return false">
    <h3 class="">${this.title}</h3>
    <div class="col s12">
    <h5 class="">Georeference</h5>
      <div id="map"></div>
    </div>
    <section class="hide">
      <div class="input-field col s6 m3">
        <input disabled id="Latitude" type="text" value="${
          window.geoReference.lat
        }">
        <label for="Latitude">Latitude</label>
      </div>
      <div class="input-field col s6 m3">
        <input disabled id="Longitude" type="text" value="${
          window.geoReference.long
        }">
        <label for="Longitude">Longitude</label>
      </div>
      <p class="col s12 m6 l4">
        <label>
          <input id="Resolved" type="checkbox">
          <span>Resolved</span>
        </label>
      </p>
    </section>
    <section class="col s12 m4">
      <h5 class="">Erosion</h5>
      <p>
        <label>
          <input checked type="radio" name="Erosion" id="Low">
          <span>Low</span>
        </label>
      </p>
      <p>
        <label>
          <input type="radio" name="Erosion" id="Medium">
          <span>Medium</span>
        </label>
      </p>
      <p>
        <label>
          <input type="radio" name="Erosion" id="High">
          <span>High</span>
        </label>
      </p>
    </section>
    <h5 class="col m8">Select All that Apply</h5>
    <section class="col s12 m4">
      <p>
        <label>
          <input id="RootsExposed" type="checkbox">
          <span>Roots Exposed</span>
        </label>
      </p>
      <p>
        <label>
          <input id="Flooded" type="checkbox">
          <span>Flooded</span>
        </label>
      </p>
      <p>
        <label>
          <input id="Bifurcation" type="checkbox">
          <span>Bifurcation - Widening</span>
        </label>
      </p>
      <p>
        <label>
          <input id="FallenTrees" type="checkbox">
          <span>Fallen Trees on Trail</span>
        </label>
      </p>
    </section>
    <section class="col m4">
      <p class="offset-m12">
        <label>
          <input id="Slippery" type="checkbox">
          <span>Slippery</span>
        </label>
      </p>
      <p>
        <label>
          <input id="SharpStones" type="checkbox">
          <span>Sharp Stones</span>
        </label>
      </p>
      <p>
        <label>
          <input id="Thorns" type="checkbox">
          <span>Thorny Vegetation on the Edge</span>
        </label>
      </p>
      <p>
        <label>
          <input id="Risk" type="checkbox">
          <span>Risk From Fallen Trees or Branches</span>
        </label>
      </p>
    </section>
    <br>
    <h5 class="col s12">Please Describe</h5>
    <div class="row">
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

    <section class="col s12 m6">
      <div class="row">
        <canvas height="64" class="col s12" id="photoPreview"></canvas>
      </div>
    </section>
    <div class="file-field input-field col s12 m6">
      <div class="file-path-wrapper col s12">
        <input id="photoFilePath" accept="image/*" class="file-path validate"
          type="text" placeholder="Trail Photos">
      </div>
      <div class="btn large col s12">
        <i class="material-icons large">add_a_photo</i>
        <input id="Photos" accept="image/*;capture=camera" type="file">
      </div>
    </div>
    <button class="col s12 btn btn-large waves-effect waves-light" type="submit"
      onclick="collectInputs('${this.databaseCollection}', '${
      this.congratulatoryMessage
    }')">Submit
      <i class="material-icons right">send</i>
    </button>
  </form>
</div>
<canvas class="fullScreenCeleb" id="confettiId"> </canvas>
`;
    const missions = document.getElementById("missions");
    missions.innerHTML = content;

    const map = L.map("map", {
      tapTolerance: 30,
      zoomControl: false
    }).setView([window.Latitude.value, window.Longitude.value], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const geoJSONTrails = require("./trails.json");

    const mappedTrails = L.geoJSON(geoJSONTrails, {
      style: function(feature) {
        return {
          color: feature.properties.stroke,
          opacity: 0.6,
          dashArray: [7, 5]
        };
      }
    });

    // map.fitBounds(window.mappedTrails.getBounds(), { padding: [82, 82] });
    mappedTrails.addTo(map);
    L.circle([window.Latitude.value, window.Longitude.value], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 5
    })
      .addTo(map)
      .bindPopup("Your Location")
      .openPopup();
    L.popup();

    window.radius = L.circle(
      [window.Latitude.value, window.Longitude.value],
      {
        color: "#0288d1",
        fillColor: "#0d47a1",
        fillOpacity: 0.5,
        radius: window.geoReference.accuracy
      }
    ).addTo(map);
  }
});

window.trails = trails;
