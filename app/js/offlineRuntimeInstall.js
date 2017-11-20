import * as OfflinePluginRuntime from "offline-plugin/runtime";
require("./../../node_modules/materialize-css/dist/js/materialize");

OfflinePluginRuntime.install({
  onInstalled: function() {
    Materialize.toast("App Installed", 4000, "blue darken-3 white-text");
  },

  onUpdating: function() {
    Materialize.toast("Updating...", 4000, "blue darken-3 white-text");
  },

  onUpdateReady: function() {
    OfflinePluginRuntime.applyUpdate();
    Materialize.toast("Update Ready", 4000, "blue darken-3 white-text");
  },
  onUpdated: function() {
    Materialize.toast("Reloading...", 10000, "blue darken-3 white-text");
    setTimeout(function() {
      window.location.reload();
    }, 10000);
  }
});
