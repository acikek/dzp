const semver = require("semver");

const Command = require("../classes/Command.js");

const cliError = require("../cli/error.js");
const getDzp = require("../cli/getDzp.js");
const updateDzp = require("../cli/updateDzp.js");

module.exports = new Command("set", "Updates a project config value", "<key> <value>")
  .setExec((parsed, key, value) => {
    const cwd = process.cwd();
    const dzp = getDzp(cwd);

    if (key === "dependencies") {
      cliError("cannot modify dependencies. Use `dzp install <repo>`");
    } else if (key === "version" && !semver.valid(value)) {
      cliError("invalid version");
    } else if (!dzp[key]) {
      cliError("key does not exist");
    }

    dzp[key] = value;
    
    updateDzp(`${cwd}/dzp.json`, dzp);
    console.log(`${key}: ${value}`);
  });