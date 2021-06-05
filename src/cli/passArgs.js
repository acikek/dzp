const help = require("../flags/help.js");
const version = require("../flags/version.js");
const cliError = require("./error.js");

const styles = require("../styles.json");

function passArgs(parsed, commands) {
  const [command, ...args] = parsed._;
  const cArr = Object.values(commands);

  if (command) {
    const c = commands[command];
    if (!c) cliError(`unknown command: ${command}`);

    if (parsed["--help"]) {
      return console.log(c.getHelp());
    }

    return c.exec(parsed, command === "help" 
      ? cArr 
      : ["new", "styles"].includes(command)
      ? [styles]
      : args
    );
  }

  if (parsed["--version"]) {
    version();
  } else {
    help(cArr, parsed["--usage"]);
  }
}

module.exports = passArgs;