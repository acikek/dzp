const Command = require("../classes/Command.js");

const cliError = require("../cli/error.js");
const getDzp = require("../cli/getDzp.js");

module.exports = new Command("get", "Retrieves a project config value", "<key>")
  .setExec((parsed, key) => {
    const dzp = getDzp(process.cwd());
    const value = dzp[key];

    if (!value) cliError("key does not exist");
    console.log(value);
  });