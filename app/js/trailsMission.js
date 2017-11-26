const Mission = require("./missions");

trails = new Mission({
  shortName: "trails",
  title: "Trail Condition",
  databaseCollection: "TrailCondition",
  congratulatoryMessage: "Thanks for completing the Trail Conditions Mission!",
  description:
    "Engage in the monitoring of Trail Conditions and participate in adaptive management by reporting incidents while walking in the trails system. Kullaberg Management will analyze measures to execute to resolve the reports.",
  image: require("../img/trail.jpg"),
  monitorSuccess: function() {
    let content = ``;
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
          <input id="Date" type="text" class="datepicker" value="${new Date().toDateString()}">
        </div>
        <div class="file-field input-field col s12">
          <div class="btn large">
          <i class="material-icons large">add_a_photo</i>
            <input id="Photos" accept="image/*;capture=camera" type="file">
          </div>
          <div class="file-path-wrapper">
            <input id="photoFilePath" accept="image/*" class="file-path validate" type="text" placeholder="Trail Photos">
          </div>
        </div>
        <button class="col s12 btn btn-large waves-effect waves-light" type="submit" onclick="collectInputs('${
          this.databaseCollection
        }', '${this.congratulatoryMessage}')">Submit
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
    `;
    missions.innerHTML = content;
    const map = L.map("map", { tapTolerance: 24 }).setView(
      [window.Latitude.value, window.Longitude.value],
      13
    );
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {}).addTo(map);
    let circle = L.circle([window.Latitude.value, window.Longitude.value], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: geoReference.accuracy
    })
      .addTo(map)
      .bindPopup("Your Location")
      .openPopup();
    const geoJSONTrails = require("./trails.json");
    L.geoJSON(geoJSONTrails, {
      style: function(feature) {
        return {
          color: feature.properties.stroke,
          opacity: 0.6,
          dashArray: [7, 5]
        };
      }
    }).addTo(map);
  }
});
