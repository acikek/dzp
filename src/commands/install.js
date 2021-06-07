const fs = require("fs");

const Command = require("../classes/Command.js");

const cliError = require("../cli/error.js");
const getDzp = require("../cli/getDzp.js");
const install = require("../cli/install.js");
const updateDzp = require("../cli/updateDzp.js");

const help = `To install the project's current dependency list, run the command without any arguments.
To force-update dependencies, run the command with the --update flag.`

module.exports = new Command("install", "Installs a dependency chain", "[<repo>] [--update]", help)
  .setExec(async (parsed, url) => {
    const here = parsed["--here"];
    const update = parsed["--update"];

    const cwd = process.cwd();
    const dir = `${cwd}${here ? "" : "/deps"}`;
    const proj = getDzp(cwd);
    const contents = fs.readdirSync(dir);

    if (!here && !fs.readdirSync(cwd).includes("deps")) {
      cliError("your project does not have a dependency folder. Re-initialize with `dzp new` and omit the `--no-deps` flag");
    }

    if (!url) {
      if (here) return cliError("must include url when installing in 'here' mode");
      if (proj.dependencies.length < 1) return cliError("project has no dependencies");

      await proj.dependencies.forEach(async u => await install(dir, u, proj, contents, update));
    } else {
      await install(dir, url, proj, contents, update, here);
    }
    
    if (!here) updateDzp(`${cwd}/dzp.json`, proj);
  });