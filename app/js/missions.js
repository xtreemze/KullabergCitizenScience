let Missions = new Set();
class Mission {
  constructor({ title, description, parameters }) {
    this.title = title;
    this.description = description;
    this.parameters = parameters;
    this.card = `<div class="cardContainer">
  <div class="col s12 m6">
    <div class="card">
      <div class="card-content">
        <span class="card-title">${this.title}</span>${this.description}</div>
    </div>
  </div>
</div>
`;
    let missions = window.getElementById("missions");
    missions.innerHTML += this.card;
    Missions.add(this);
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
