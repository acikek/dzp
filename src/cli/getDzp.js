const fs = require("fs");

const cliError = require("./error.js");

function getDzp(cwd, force) {
  try {
    return JSON.parse(fs.readFileSync(`${cwd}/dzp.json`));
  } catch (err) {
    if (force) return {};
    cliError("no DeniZip project found in this directory. Create one with `dzp new`");
  }
}

module.exports = getDzp;