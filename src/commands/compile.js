const fs = require("fs");

const Command = require("../classes/Command.js");

const cliError = require("../cli/error.js");
const getDzp = require("../cli/getDzp.js");
const getScripts = require("../cli/scripts.js");

function sortMetadata(m) {
  return m.raw
    .sort((a, b) => {
      const cmdA = a.startsWith("@");
      const cmdB = b.startsWith("@");

      if (cmdA && !cmdB) return 1;
      else if (!cmdA && cmdB) return -1;
      else return 0;
    })
    .map(c => `# ${c}`);
}

module.exports = new Command("compile", "Compiles the project to a single file", "<path>")
  .setExec(async (parsed, path) => {
    if (!path) cliError("path not provided");

    const cwd = process.cwd();
    const dir = `${cwd}/${path}`;
    const dzp = getDzp(cwd, true);

    const scriptData = await getScripts(null, true, true, false);
    const scripts = scriptData
      .sort((a, b) => a.type.localeCompare(b.type))
      .map(d => {
        d.metadata.raw = sortMetadata(d.metadata);
        return `${d.metadata.raw.join("\n")}\n\n${d.data.join("\n")}`;
      })
      .join("\n\n\n");

    const data = 
`#: dzp-ignore

#| ${dzp.name || "Project Name"}
#| ${dzp.description || "Project Description"}
#|
#| @version ${dzp.version || "1.0.0"}
#| @author ${dzp.author || "Author"}


${scripts}`;

    fs.writeFileSync(dir, data);
  });