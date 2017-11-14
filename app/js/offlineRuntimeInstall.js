import * as OfflinePluginRuntime from "offline-plugin/runtime";

OfflinePluginRuntime.install({
  onInstalled: function() {},

  onUpdating: function() {},

  onUpdateReady: function() {
    OfflinePluginRuntime.applyUpdate();
  },
  onUpdated: function() {
    setTimeout(function() {
      window.location.reload();
    }, 10000);
  }
});
