import * as OfflinePluginRuntime from "offline-plugin/runtime";
require("./../../node_modules/materialize-css/dist/js/materialize");

OfflinePluginRuntime.install({
  onInstalled: function() {
    M.toast({
      html: "App Installed",
      displayLength: 1000,
      classes: "blue darken-2"
    });
  },

  onUpdating: function() {
    M.toast({
      html: "Updating...",
      displayLength: 1000,
      classes: "blue darken-2"
    });
  },

  onUpdateReady: function() {
    OfflinePluginRuntime.applyUpdate();
    M.toast({
      html: "Update Ready",
      displayLength: 1000,
      classes: "blue darken-2"
    });
  },
  onUpdated: function() {
    setTimeout(function() {
      window.location.reload();
    }, 4000);
    M.toast({
      html: "Reloading",
      displayLength: 3500,
      classes: "blue darken-2"
    });
  }
});
