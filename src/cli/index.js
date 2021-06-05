const parseArgs = require("./parseArgs.js");

function cli(args) {
  return parseArgs(args);
}

module.exports = cli;