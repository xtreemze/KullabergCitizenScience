const TrailsMission = require("./trailsMission");
const TumlareMission = require("./tumlareMission");

const bonusMissionTrails = require("./bonusMissions.json");

for (let bmt of bonusMissionTrails.features) {
    switch (bmt.shortName) {
        case "trails":
            new TrailsMission({
                shortName: bmt.shortName,
                title: bmt.title,
                image: bmt.image,
                description: bmt.description,
                mission_area: { "type": bmt.type, "properties": bmt.properties, geometry: bmt.geometry }
            });
            break;
        case "tumlare":
            new TumlareMission({
                shortName: bmt.shortName,
                title: bmt.title,
                image: bmt.image,
                description: bmt.description,
                mission_area: { type: bmt.type, properties: bmt.properties, geometry: bmt.geometry }
            });
            break;
        default: console.log("Unknown mission type: " +bmt.shortName);
    }
}
