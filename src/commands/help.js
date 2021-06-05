const Command = require("../classes/Command.js");
const help = require("../flags/help.js");

module.exports = new Command("help", "Displays the help message", "[--usage]")
  .setExec((parsed, ...commands) => {
    help(commands, parsed["--usage"]);
  });