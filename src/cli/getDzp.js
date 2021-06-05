const fs = require("fs");

const cliError = require("./error.js");

function getDzp(cwd, force) {
  try {
    return JSON.parse(fs.readFileSync(`${cwd}/dzp.json`));
  } catch (err) {
    if (force) return {};
    cliError(err.message);
  }
}

module.exports = getDzp;