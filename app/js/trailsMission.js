const Mission = require("./missions");

class TrailsMission {
  constructor({
      shortName = "trails",
      title = "Trail Condition",
      image = require("../img/trail.jpg"),
      description = "Engage in the monitoring of Trail Conditions and participate in adaptive management by reporting incidents while walking in the trails system. Kullaberg Management will analyze measures to execute to resolve the reports.",
      mission_area
  }) {
    this.mission_area = mission_area;
    this.mission = new Mission({
        shortName: shortName,
        title: title,
        databaseCollection: "TrailCondition",
        congratulatoryMessage: "Thanks for helping us keep Kullaberg in top shape!",
        description: description,
        image: image,
        mission_area: mission_area,
        monitorSuccess: function() {
            let content = ``;
            content += `<div class="row">
  <form class="" onsubmit="return false">
    <h3 class="col s12">${this.formattedTitle}</h3>
    <section class="">
      <h5 class="col s12">Georeference</h5>
      <div class="col s12">
        <div id="map"></div>
      </div>
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
      <div class="input-field col s6 m4">
        <label for="Date">Date</label>
        <input disabled id="Date" type="text" class="datepicker" value="${new Date().toDateString()}">
      </div>
      <p class="col s12 m6 l4">
      <label>
        <input id="Resolved" type="checkbox">
        <span>Resolved</span>
      </label>
    </p>
    </section>
    <h5 class="col s12">Select All that Apply</h5>
    <p class="col s12 m6 l4">
      <label>
        <input id="RootsExposed" type="checkbox">
        <span>Roots Exposed</span>
      </label>
    </p>
    <p class="col s12 m6 l4">
      <label>
        <input id="Flooded" type="checkbox">
        <span>Flooded</span>
      </label>
    </p>
    <p class="col s12 m6 l4">
      <label>
        <input id="Bifurcation" type="checkbox">
        <span>Bifurcation - Widening</span>
      </label>
    </p>
    <p class="col s12 m6 l4">
      <label>
        <input id="FallenTrees" type="checkbox">
        <span>Fallen Trees on Trail</span>
      </label>
    </p>
    <p class="col s12 m6 l4">
      <label>
        <input id="Slippery" type="checkbox">
        <span>Slippery</span>
      </label>
    </p>
    <p class="col s12 m6 l4">
      <label>
        <input id="SharpStones" type="checkbox">
        <span>Sharp Stones</span>
      </label>
    </p>
    <p class="col s12 m6 l4">
      <label>
        <input id="Thorns" type="checkbox">
        <span>Thorny Vegetation on the Edge</span>
      </label>
    </p>
    <p class="col s12 m6 l4">
      <label>
        <input id="Risk" type="checkbox">
        <span>Risk From Fallen Trees or Branches</span>
      </label>
    </p>
    <div class="input-field col s12 m6 l4">
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
    <section class="col s12 m6">
      <div class="row">
        <canvas height="64" class="col s12" id="photoPreview"></canvas>
      </div>
    </section>
    <div class="file-field input-field col s12 m6">
      <div class="file-path-wrapper col s12">
        <input id="photoFilePath" accept="image/*" class="file-path validate" type="text" placeholder="Trail Photos">
      </div>
      <div class="btn large col s12">
        <i class="material-icons large">add_a_photo</i>
        <input id="Photos" accept="image/*;capture=camera" type="file">
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

            const map = L.map("map", {
                tapTolerance: 30,
                zoomControl: false
            }).setView([window.Latitude.value, window.Longitude.value], 13);

            var OSMMapnik = L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    maxZoom: 19,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }
            ).addTo(map);

            // L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {}).addTo(map);

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

            if (mission_area) {
                window.missionPolygons = [];
                for (let i = 0; i < mission_area.geometry.coordinates.length; i++) {
                    window.missionPolygons.push(
                        L.circle([mission_area.geometry.coordinates[i][1],
                                  mission_area.geometry.coordinates[i][0]],
                                  mission_area.properties.radius, {
                                opacity: 0.00,
                                fillColor: "green",
                                fillOpacity: 0.35,
                            }).addTo(map));
                }

                let mission_trails = L.geoJSON(mission_area, {
                    style: function (feature) {
                        return {
                            color: "white",
                            opacity: 0.0,
                            dashArray: [7, 5]
                        };
                    }
                });
                map.fitBounds(mission_trails.getBounds(), {padding: [40, 40]});
                mission_trails.addTo(map);
            }

            const geoJSONTrails = require("./trails.json");
            L.geoJSON(geoJSONTrails, {
                style: function (feature) {
                    return {
                        color: feature.properties.stroke,
                        opacity: 0.6,
                        dashArray: [7, 5]
                    };
                }
            }).addTo(map);
        }
    });
  }
}

trails = new TrailsMission({}).mission;

module.exports = TrailsMission;