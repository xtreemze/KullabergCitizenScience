let Missions = new Set();
const missionsElement = document.getElementById("missions");
missionsElement.innerHTML += `<h4 class="blue-text text-darken-3">Choose Your Mission</h3>`;

class Mission {
  constructor({ title = "", description = "", parameters = {} }) {
    this.title = title;
    this.description = description;
    this.parameters = parameters;
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
  <div class="col s12 m6">
    <div class="card">
      <div class="card-content">
        <span class="card-title">${this.title}</span>${this.description}</div>
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
  description: "Help to gather data on trail conditions in Kullaberg."
});

tumlare = new Mission({
  title: "Porpoise Spotting",
  description: "Gather data on porpoises in Kullaberg."
});
