const Command = require("../classes/Command.js");

module.exports = new Command("styles", "Lists the loaded style names", "")
  .setExec((flags, styles) => {
    console.log(Object.keys(styles).join(", "));
  });