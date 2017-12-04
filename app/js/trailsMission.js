const Mission = require("./missions");

trails = new Mission({
  shortName: "trails",
  title: "Trail Condition",
  databaseCollection: "TrailCondition",
  congratulatoryMessage: "Thanks for helping us keep Kullaberg in top shape!",
  description:
    "Engage in the monitoring of Trail Conditions and participate in adaptive management by reporting incidents while walking in the trails system. Kullaberg Management will analyze measures to execute to resolve the reports.",
  image: require("../img/trail.jpg"),
  monitorSuccess: function() {
    let content = ``;
    content += `<div class="row">
  <form class="" onsubmit="return false">
    <h3 class="col s12">${this.title}</h3>
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
    <section class="hide">
      <h5 class="col s12">Georeference</h5>
      <div class="col s12">
        <div id="map"></div>
      </div>
      <div class="input-field col s6 m3">
        <input disabled id="Latitude" type="number" value="${
          window.geoReference.lat
        }">
        <label for="Latitude">Latitude</label>
      </div>
      <div class="input-field col s6 m3">
        <input disabled id="Longitude" type="number" value="${
          window.geoReference.long
        }">
        <label for="Longitude">Longitude</label>
      </div>
      <div class="col s6 m4">
        <label for="Date">Date</label>
        <input disabled id="Date" type="date" class="datepicker" value="${new Date()}">
      </div>
      <p class="col s12 m6 l4">
        <label>
          <input id="Resolved" type="checkbox">
          <span>Resolved</span>
        </label>
      </p>
    </section>
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
<canvas class="fullScreenCeleb" id="confettiId"> </canvas>
`;
    missions.innerHTML = content;
  }
});
