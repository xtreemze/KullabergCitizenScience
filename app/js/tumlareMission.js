const Mission = require("./missions");

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
    const mission = this;
    let content = ``;
    const success = function() {
      content += `<div class="row">
      <form class="" onsubmit="return false">
        <h3 class="col s12">${mission.title}</h3>
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
        <div class="col s12">
          <div id="map"></div>
          <div>
            <div class="col s10 range-field">
              <label>Area of Observation</label>
              <input id="ObservationArea" type="range" min="1" max="200" value="20">
            </div>
            <p class="col s2">
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
            <button class="section col s12 btn btn-large waves-effect waves-light" type="submit" onClick="window.collectInputs('${mission.databaseCollection}', '${mission.congratulatoryMessage}')">Submit
              <i class="material-icons right">send</i>
            </button>
      </form>
      </div>
    `;
      missions.innerHTML = content;
      navigationBreadcrumbs.innerHTML = `
            <a onclick="showMissions()" class="pointer breadcrumb">${mission.title}</a>
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
    };
    navigator.geolocation.getCurrentPosition(
      position => {
        M.toast({
          html: "GPS Located",
          displayLength: 4000,
          classes: "green darken-2"
        });
        window.geoReference = {
          lat: position.coords.latitude || 0,
          long: position.coords.longitude || 0,
          alt: position.coords.altitude || 0
        };
        success();
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
    missions.innerHTML = content;
    navigationBreadcrumbs.innerHTML = `
  
  <a onclick="showMissions()" class="pointer breadcrumb">${this.title}</a>
  <a class="pointer breadcrumb">Analyze</a>
  `;
    window.scrollTo(0, 0);
    navigator.geolocation.getCurrentPosition(position => {
      M.toast({
        html: "GPS Located",
        displayLength: 4000,
        classes: "green darken-2"
      });
      (window.geoReference = {
        lat: position.coords.latitude || 0,
        long: position.coords.longitude || 0,
        alt: position.coords.altitude || 0
      }),
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
