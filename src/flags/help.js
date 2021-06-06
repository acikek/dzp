const { EOL } = require("os");
const config = require("../config.json");
const package = require("../../package.json");

function help(commands, showUsage) {
  const headers = commands.map(c => [`${c.name}${showUsage ? ` ${c.usage}` : ""}`, c.desc]);
  const l = headers.map(h => h[0].length).sort((a, b) => a - b).reverse()[0];
  const formatted = headers.map(h => `${h[0]}${" ".repeat(l - h[0].length)}  ${h[1]}`);
  
  console.log(`
${config.logo}


Usage: dzp <command> [--help]

${formatted.join(EOL)}

dzp@${package.version} - ${package.repository.url}`);
}

module.exports = help;