const { EOL } = require("os");

const Command = require("../classes/Command.js");
const getScripts = require("../cli/scripts.js");

const help = `Run without arguments to list all script names.
Use the --data flag to view the raw script.`;

module.exports = new Command("script", "Finds info about a script", "[<name>] [--list] [--data]", help)
  .setExec(async (parsed, name) => {
    const s = await getScripts(name);

    if (!name) {
      console.log(s
        .map(o => o.name)
        .sort()
        .join(`${parsed["--list"] ? EOL : ", "}`)
      );
    } else {
      if (parsed["--data"]) {
        console.log(s.data.join(EOL));
      } else {
        console.log(
`Name: ${name}
Type: ${s.type}
Path: ${s.path}`
        );
      }
    }
  });