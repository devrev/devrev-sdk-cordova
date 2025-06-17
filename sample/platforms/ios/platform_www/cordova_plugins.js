cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "devrev-cordova-plugin.DevRevPlugin",
      "file": "plugins/devrev-cordova-plugin/www/DevRevPlugin.js",
      "pluginId": "devrev-cordova-plugin",
      "clobbers": [
        "DevRev"
      ]
    }
  ];
  module.exports.metadata = {
    "devrev-cordova-plugin": "1.0.0"
  };
});