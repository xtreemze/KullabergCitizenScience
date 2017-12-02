const Mission = require("./missions");

tumlare = new Mission({
  shortName: "tumlare",
  title: "Porpoise Observation",
  databaseCollection: "Tumlare",
  congratulatoryMessage: "Thanks for you help with wildlife research!",
  description:
    "Engage in the collection of visual harbor porpoise observations (both living and dead) in the north-western parts of Scania. Observations are used in scientific research to help increase the knowledge about this threatened species.",
  image: require("../img/tumlare.jpg"),
  monitorSuccess: function() {
    let content = ``;
    content += `<div class="row">
    <form class="" onsubmit="return false">
      <h3 class="col s12">${this.title}</h3>
      <div class="input-field col l2 m4 s12">
        <label for="Species">Species</label>
        <input id="Species" type="text" value="Porpoise">
      </div>
      <p class="col s6 m4 l2">
        <label>
          <input id="BinocularsUsed" type="checkbox">
          <span>Observation Made with Binoculars</span>
        </label>
      </p>
      <p class="col s6 m4 l2">
        <label>
          <input id="UncertainQuantity" type="checkbox">
          <span>Uncertain Quantity</span>
        </label>
      </p>
      <div class="col s8 m10 l5 range-field right">
      <label>Quantity</label>
      <input id="Quantity" type="range" min="1" max="20" value="10">
      </div>
      <p class="col s4 m2 l1 right-align">
        <span id="QuantityDisplay" class="helper-text">10</span>
      </p>
      <h5 class="col s12">Location of Sighting</h5>
      <section class="hide">
      <div class="input-field col s6 m4">
        <input disabled id="Latitude" type="text" value="${
          window.geoReference.lat
        }">
        <label for="Latitude">Latitude</label>
      </div>
      <div class="input-field col s6 m4">
        <input disabled id="Longitude" type="text" value="${
          window.geoReference.long
        }">
        <label for="Longitude">Longitude</label>
      </div>
      <div class="input-field col s6 m4">
        <label class="" for="Date">Date</label>
        <input id="Date" type="text" class="datepicker" value="${new Date().toDateString()}">
      </div>
      </section>
      <p class="col s12">Locate the sighting on the map.</p>
      <div class="col s12">
        <div id="map"></div>
        <div>
        <div class="col s8 m10 l5 range-field right">
        <label>Area of Observation</label>
        <input id="ObservationArea" type="range" min="1" max="200" value="20">
        </div>
        <p class="col s4 m2 l7 right-align">
          <span id="ObservationAreaDisplay" class="helper-text">20</span>
          <span class="meters">m</span>
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
          <section class="col s12 m6">
          <div class="row">
            <canvas height="64" class="col s12" id="photoPreview"></canvas>
          </div>
        </section>
        <div class="file-field input-field col s12 m6">
          <div class="file-path-wrapper col s12">
            <input id="photoFilePath" accept="image/*" class="file-path validate" type="text" placeholder="Observation Photos">
          </div>
          <div class="btn large col s12">
            <i class="material-icons large">add_a_photo</i>
            <input id="Photos" accept="image/*;capture=camera" type="file">
          </div>
        </div>
          <button class="section col s12 btn btn-large waves-effect waves-light" type="submit" onClick="window.confetti() window.collectInputs('${
            this.databaseCollection
          } ', '${this.congratulatoryMessage}')">Submit
            <i class="material-icons right">send</i>
          </button>
    </form>
    </div>
    <div>
    <canvas class="fullScreenCeleb" id="confettiId"> </canvas>
    </div>
  `;
    missions.innerHTML = content;

    window.confetti = function(){
      let confettiCanvas = document.getElementById('confettiId');
      
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
      
      let ctx = confettiCanvas.getContext('2d');
      let confettiPieces = [];
      let numberConfettiPieces = 150;
      let lastUpdateTime = Date.now();
      
      function randomColor(){
          let colors =[ '#95F9E3', '#2E914C', '#0d47a1', '#F96900', '#B0DB43', '#F95454', '#FFE821', '#0496FF'];
          return colors[Math.floor(Math.random() * colors.length)];
      }
      
      function update(){
          let now = Date.now();
          deltaTime = now - lastUpdateTime;
      
          for (let i = confettiPieces.length -1 ; i >= 0; i--){
              let p = confettiPieces [i];
      
              if (p.y > confettiCanvas.height){
                  confettiPieces.splice(i,1);
                  continue;
              }
              p.y += p.gravity;
              p.rotation += p.rotationSpeed * deltaTime;
          }
      
      
          lastUpdateTime = now;
      
          setTimeout(update, 1);
      }
      
      function draw() {
          ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
      
          confettiPieces.forEach(function (p) {
          ctx.save();
      
          ctx.fillStyle = p.color;
      
          ctx.translate(p.x + p.size / 2, p.y - p.size / 2);
          ctx.rotate(p.rotation);
      
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      
          ctx.restore();
      
          });
      
          requestAnimationFrame(draw);
      }
      
      function ConfettiPieces(x, y) {
      
          this.x = x;
          this.y = y ;
          this.size = (Math.random() * 0.5 + 0.75) * 14;
          this.gravity = (Math.random() * 0.5 + 0.75) * 1.1;
          this.rotation = (Math.PI * 2) * Math.random();
          this.rotationSpeed = (Math.PI * 2) * (Math.random() - 0.5) * 0.001;
          this.color = randomColor();
      }
      
      
      while (confettiPieces.length < numberConfettiPieces) {
          confettiPieces.push(new ConfettiPieces(Math.random() * confettiCanvas.width, Math.random() * confettiCanvas.height));
      }
      
      
      update();
      draw();
    }

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

    window.radius = L.circle([window.Latitude.value, window.Longitude.value], {
      color: "#0288d1",
      fillColor: "#0d47a1",
      fillOpacity: 0.5,
      radius: geoReference.accuracy
    }).addTo(map);

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

    ObservationArea.addEventListener(
      "mousemove",
      function() {
        ObservationAreaDisplay.innerHTML = ObservationArea.value;
        radius.setRadius(ObservationArea.value);
      },
      { passive: true }
    );
    ObservationArea.addEventListener(
      "touchmove",
      function() {
        ObservationAreaDisplay.innerHTML = ObservationArea.value;
        radius.setRadius(ObservationArea.value);
      },
      { passive: true }
    );
    ObservationArea.addEventListener(
      "change",
      function() {
        ObservationAreaDisplay.innerHTML = ObservationArea.value;
        radius.setRadius(ObservationArea.value);
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
  }
});
