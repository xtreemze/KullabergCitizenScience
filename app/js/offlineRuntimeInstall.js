import * as OfflinePluginRuntime from "offline-plugin/runtime";
import M from "materialize-css";
// require("./../../node_modules/materialize-css/dist/js/materialize");

OfflinePluginRuntime.install({
  onInstalled: function() {
    M.toast({
      html: "App Installed",
      displayLength: 500,
      classes: "blue darken-2"
    });
  },

  onUpdating: function() {
    M.toast({
      html: "Updating...",
      displayLength: 500,
      classes: "blue darken-2"
    });
  },

  onUpdateReady: function() {
    const foot = document.getElementById("foot");
    OfflinePluginRuntime.applyUpdate();
    foot.classList.add("fadeIn");
    M.toast({
      html: "Update Ready",
      displayLength: 500,
      classes: "blue darken-2"
    });
  },
  onUpdated: function() {
    setTimeout(function() {
      window.location.reload();
    }, 500);
    M.toast({
      html: "Reloading",
      displayLength: 500,
      classes: "blue darken-2"
    });
  }
});
