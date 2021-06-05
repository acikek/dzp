const cli = require("./cli");

const loadCommands = require("./cli/loadCommands");
const passArgs = require("./cli/passArgs.js");

module.exports = function(process) {
  const args = process.argv.slice(2);
  const parsed = cli(args);

  passArgs(parsed, loadCommands());
}