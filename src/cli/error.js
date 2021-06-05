const chalk = require("chalk");

function cliError(msg, warn) {
  const err = chalk
    [warn ? "yellow" : "red"]
    .bold(warn ? "WARN!" : "ERR!");

  console.error(`${err} ${msg}`);
  process.exit(1);
}

module.exports = cliError;