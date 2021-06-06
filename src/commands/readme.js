const fs = require("fs");

const Command = require("../classes/Command.js");

const cliError = require("../cli/error.js");
const getDzp = require("../cli/getDzp.js");
const getScripts = require("../cli/scripts.js");

const help = `Use the '--json' flag to save the resulting object to 'dzp-readme.json'.
Use the '--use <path>' flag to retrieve the data from a JSON file, saving to README.md as normal.`;

module.exports = new Command("readme", "Generates a README file", "[--json] [--use <path>]", help)
  .setExec(async (parsed) => {
    const cwd = process.cwd();
    const dzp = getDzp(cwd);
    const sep = "\n\n";

    if (parsed["--use"]) {
      try {
        const obj = require(`${cwd}/${parsed["--use"]}`);
        fs.writeFileSync(`${cwd}/README.md`, Object.values(obj).join(sep));
      } catch (err) {
        cliError(err);
      }
      
      return;
    }

    const title = !!dzp.name ? dzp.name : "Project Name";
    const description = !!dzp.description ? dzp.description : "Your project's description. Keep it short and sweet.";

    // Sections
    const header = `# ${title}${sep}${description}`;
    const about = `## About${sep}Put information about your project here, such as what it's used for, its features, etc. Make it clear what the project is about.`;
    
    const repo = !!dzp.repository ? dzp.repository : "<repository link>";

    const setup = 
`## Setup

Install with [dzp](https://github.com/acikek/dzp):
\`\`\`sh
dzp install ${repo}
\`\`\`

Install with git:
\`\`\`sh
git clone ${repo}
\`\`\``;

    const example = `## Example${sep}Use this space to guide the user through the features your project provides. If all they need to worry about is installation, then you can omit this section.`;  

    // Script section
    const scriptData = await getScripts();
    const categories = {};

    scriptData.forEach(s => {
      const type = s.type;
      const name = s.name;

      if (!categories[type]) {
        categories[type] = [name];
      } else {
        categories[type].push(name);
      }
    });

    const scriptSections = Object.entries(categories)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(s => {
        const [type, scripts] = s;
        return `### ${type[0].toUpperCase()}${type.slice(1)}\n${scripts.map(n => `- \`${n}\``).join("\n")}`;
      });
    
    const scripts = `## Scripts${sep}${scriptSections.length > 0 ? scriptSections.join(sep) : "Maybe you should write some scripts..."}`;
    const license = `## License${sep}([LICENSE](https://choosealicense.com)) © (YEAR) (NAME)`;

    if (parsed["--json"]) {
      fs.writeFileSync(`${cwd}/dzp-readme.json`, JSON.stringify({
        header, about, setup, example, scripts, license
      }, null, 2));
    } else {
      const product = [
        header,
        about,
        setup,
        example,
        scripts,
        license
      ].join(sep);
      
      fs.writeFileSync(`${cwd}/README.md`, product);
    }
  });