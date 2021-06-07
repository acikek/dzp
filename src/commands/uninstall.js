const Command = require("../classes/Command.js");

const cliError = require("../cli/error.js");
const getDzp = require("../cli/getDzp.js");
const uninstall = require("../cli/uninstall.js");
const updateDzp = require("../cli/updateDzp.js");

module.exports = new Command("uninstall", "Uninstalls a dependency", "<name> [--here]")
  .setExec(async (parsed, pkg) => {
    if (!pkg) return cliError("no package name provided");

    const here = parsed["--here"];
    const cwd = process.cwd();
    const dir = `${cwd}${here ? "" : "/deps"}`;
    const proj = getDzp(cwd);

    await uninstall(dir, pkg);

    if (!here) {
      // bad!
      proj.dependencies = proj.dependencies.filter(e => !e.endsWith(pkg));
      updateDzp(`${cwd}/dzp.json`, proj);
    }
  });