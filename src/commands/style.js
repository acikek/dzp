const Command = require("../classes/Command.js");
const cliError = require("../cli/error.js");

module.exports = new Command("style", "Finds info about a style", "[<name>]", "Run without arguments to list all style names.")
  .setExec((parsed, name) => {
    const styles = parsed["--styles"];

    if (!!name) {
      const s = styles[name];
      if (!s) cliError("style not found");

      console.log(
`Directories: ${s.dirs.length > 0 ? s.dirs.join(", ") : "None"}
Main file: ${s.main || "<working directory>"}
Config file: ${s.config || "None"}`
      );
    } else {
      console.log(Object.keys(styles).join(", "));
    }
  });