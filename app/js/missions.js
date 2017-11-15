let Missions = new Set();
const missionsElement = document.getElementById("missions");
missionsElement.innerHTML += `<h4 class="blue-text text-darken-3">Choose Your Mission</h3>`;

class Mission {
  /**
   * Creates an instance of Mission.
   * @param {object} {
   *     title = "Title",
   *     description = "Description",
   *     parameters = { monitor: function() {}, analyze: function() {} },
   *     image = require("../img/trail.jpg")
   *   } 
   * @memberof Mission
   */
  constructor({
    title = "Title",
    description = "Description",
    parameters = { monitor: function() {}, analyze: function() {} },
    image = require("../img/trail.jpg")
  }) {
    this.title = title;
    this.description = description;
    this.parameters = parameters;
    this.image = image;
    this.getPosition = `<div class="col s12 m6">
  <div class="card">
    <div class="card-content">
      <span class="card-title">Your Position</span>
      <span id="coordinates">
        You have not granted permission for us to locate your position.
      </span>
    </div>
  </div>
</div>
<div id="sendButton" class="col s12 center"> </div>
`;
    this.card = `<div class="cardContainer" id="${this.title}">
  <div class="col s12 m6 l4">
    <div class="card medium">
      <div class="card-image">
        <img src="${this.image}">
        <span class="card-title">${this.title}</span>
      </div>
      <div class="card-content">
        <p>${this.description}</p>
      </div>
      <div class="card-action">
        <a class="pointer" onclick="${this.parameters.monitor()}">Monitor</a>
        <a class="pointer" onclick="${this.parameters.analyze()}">Analyze</a>
      </div>
    </div>
  </div>
</div>
`;
    Missions.add(this);

    missionsElement.innerHTML += this.card;
  }
}

trails = new Mission({
  title: "Trail Conditions",
  description: "Participate in monitoring trail conditions in Kullaberg.",
  image: require("../img/trail.jpg")
});

tumlare = new Mission({
  title: "Porpoise Activity",
  description: "Participate in monitoring porpoise activity in Kullaberg.",
  image: require("../img/tumlare.jpg")
});

// test = new Mission({});
