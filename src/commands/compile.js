const fs = require("fs");

const Command = require("../classes/Command.js");

const cliError = require("../cli/error.js");
const getDzp = require("../cli/getDzp.js");
const getScripts = require("../cli/scripts.js");

module.exports = new Command("compile", "Compiles the project to a single file", "<path>")
  .setExec(async (parsed, path) => {
    if (!path) cliError("path not provided");

    const cwd = process.cwd();
    const dir = `${cwd}/${path}`;
    const dzp = getDzp(cwd, true);

    const scriptData = await getScripts();
    const scripts = scriptData
      .sort((a, b) => a.type.localeCompare(b.type))
      .map(d => d.data.join("\n"))
      .join("\n\n");

    const data = 
`#| ${dzp.name || "Project Name"}
#| ${dzp.description || "Project Description"}
#|
#| @version ${dzp.version || "1.0.0"}
#| @author ${dzp.author || "Author"}`;

    console.log(data);
  });