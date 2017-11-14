navigator.geolocation.getCurrentPosition(
  position => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    const alt = position.coords.altitude;
    const userPosition = `Latitude: ${lat}<br> Longitude: ${long} <br> Altitude: ${alt}`;
    const mapLink = `https://www.google.com/maps/?q=${lat}%2C${long}`;
    document.getElementById(
      "coordinates"
    ).innerHTML = `<a target="_blank" href=${mapLink}>${userPosition}</a>`;
    document.getElementById(
      "sendButton"
    ).innerHTML = `<a class="btn-large white-text blue darken-4 waves-effect waves-light" href="mailto:carlos@2activedesign.com?subject=Kullaberg%20Report&body=Location%3A%0D%0A${mapLink}%0D%0A%0D%0AReport%3A%0D%0A%0D%0A">Send</a>
  `;
  },
  () => {
    document.getElementById("coordinates").innerText =
      "We are unable to locate your device. Please describe your location as best you can.";
    if (window.test) {
      const lat = 56.301339399999996;
      const long = 12.452367899999999;
      const alt = null;
      const userPosition = `Latitude: ${lat}<br> Longitude: ${long} <br> Altitude: ${alt}`;
      const mapLink = `https://www.google.com/maps/?q=${lat}%2C${long}`;
      document.getElementById(
        "coordinates"
      ).innerHTML = `<a target="_blank" href=${mapLink}>${userPosition}</a>`;
      document.getElementById(
        "sendButton"
      ).innerHTML = `<a class="btn-large white-text blue darken-4 waves-effect waves-light" href="mailto:carlos@2activedesign.com?subject=Kullaberg%20Report&body=Location%3A%0D%0A${mapLink}%0D%0A%0D%0AReport%3A%0D%0A%0D%0A">Send</a>
  `;
    }
  },
  {
    enableHighAccuracy: true
  }
);
