const path = require("path");

const chalk = require("chalk");

const Command = require("../classes/Command.js");
const getScripts = require("../cli/scripts.js");

const help = `Run without arguments to list all script names.
Use the --list flag to organize the script names with newlines.

Use the --save flag to save the script data for this command to use again.
Use the --force flag to ignore the existing script data if present.

Use the --data flag to view the raw script.`;

const formatSection = title => chalk.cyanBright.bold(`== ${title} ==`);
const formatList = (name, items) => `${formatSection(name)}\n${items.map(i => `- ${chalk.greenBright(`${i.name} (${i.type})`)}: ${i.info}`).join("\n")}`;

function formatMetadata(name, s) {
  const m = s.metadata;
  const result = [];

  result.push(
`${formatSection("METADATA")}
Name: ${name}
Type: ${s.type}
Path: ${s.path} ${chalk.gray(`(${process.cwd()}${path.sep}${s.path})`)}`
  );

  if (m.deprecated) result.push(`${chalk.yellow.bold("WARNING:")} This script is ${chalk.red("deprecated")}!`);
  if (m.desc.length > 0) result.push(m.desc.join("\n"));
  if (m.usage) result.push(`${formatSection("USAGE")}\n${m.usage[0].type}`);

  if (m.def) result.push(formatList("DEFINITIONS", m.def));
  if (m.determine) result.push(`${formatSection("DETERMINE")}\n${chalk.greenBright(`(${m.determine[0].type})`)} ${m.determine[0].name}`);
  if (m.key) result.push(formatList("SCRIPT KEYS", m.key));
  if (m.uses) result.push(`${formatSection("USES")}\n${m.uses[0].type.split("\n").join("").split(" ").map(s => `- ${s}`).join("\n")}`)

  return result;
}

module.exports = new Command("script", "Finds info about a script", "[<name>] [--list] [--data] [--save] [--force]", help)
  .setExec(async (parsed, name) => {
    const s = await getScripts(name, parsed);

    if (!name) {
      console.log(s
        .map(o => o.name)
        .sort()
        .join(`${parsed["--list"] ? "\n" : ", "}`)
      );
    } else {
      if (parsed["--data"]) {
        console.log(s.data.join("\n"));
      } else {
        const formatted = formatMetadata(name, s);

        console.log(formatted.join("\n\n"));
      }
    }
  });