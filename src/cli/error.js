const chalk = require("chalk");

function cliError(msg, warn, terminate = true) {
  const err = chalk
    [warn ? "yellow" : "red"]
    .bold(warn ? "WARN!" : "ERR!");

  console.error(`${err} ${msg}`);
  if (terminate) process.exit(1);
}

module.exports = cliError;