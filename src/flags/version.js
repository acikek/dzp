const package = require("../../package.json");

function version() {
  console.log(package.version);
}

module.exports = version;