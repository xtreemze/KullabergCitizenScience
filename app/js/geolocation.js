navigator.geolocation.getCurrentPosition(
  position => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let alt = position.coords.altitude;
  },
  () => {
    console.log(
      "We are unable to locate your device. Please describe your location as best you can."
    );
  },
  {
    enableHighAccuracy: true
  }
);
