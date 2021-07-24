const { EOL } = require("os");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const util = require("util");

const semver = require("semver");

const Command = require("../classes/Command.js");
const cliError = require("../cli/error.js");
const config = require("../config.json");

const help = `name: The project name
acronym: The project acronym, used as a namespace
description: The description, used in README
version: The current version of the project
repository: The git repository of the project, if any
author: Your username`;

async function cliPrompt(msg, def, q) {
  const res = await q(`${msg}:${ def ? ` (${def})` : ""} `);
  return res || def;
}

async function versionPrompt(q) {
  let result = await cliPrompt("version", "1.0.0", q);

  while (!semver.valid(result)) {
    console.log(`Invalid version: "${result}"`);
    result = await cliPrompt("version", "1.0.0", q)
  }

  return result;
}

module.exports = new Command(
  "new", 
  "Creates a new DeniZip project", 
  "[--style <style>] [--spacing <spaces>] [--no-deps] [--no-git]",
  help
)
  .setExec(async (parsed) => {
    const style = parsed["--styles"][(parsed["--style"] || "project").toLowerCase()];
    if (!style) cliError("style not found");

    [style.main, style.config]
      .forEach(s => {
        if (s && !s.endsWith("/")) cliError("main and config style paths must end with a '/'");
      });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = util.promisify(rl.question).bind(rl);
    
    rl.on("SIGINT", () => cliError("init canceled", true));

    const cwd = process.cwd();
    console.log(config.newMsg);

    // Prompts
    const name = (await cliPrompt("project name", path.basename(cwd), question)).replace(/ /g, "_")
    const acronym = (await cliPrompt("acronym", "", question)).toLowerCase();
    const description = await cliPrompt("description", "", question);
    const version = await versionPrompt(question);
    const repository = await cliPrompt("repository", "", question);
    const author = await cliPrompt("author", "", question);

    // Close stream
    rl.close();

    // Generate dzp.json
    const dzp = JSON.stringify({
      name,
      description,
      version,
      author,
      repository,
      dependencies: []
    }, null, parsed["--spacing"] || 2);

    const confName = `${!!acronym ? acronym : name.toLowerCase()}_config`;

    // Generate main file
    const main = 
`${name.toLowerCase()}:
  type: world
  events:
    after reload scripts:
    - if <script[${confName}].data_key[enabled]>:
      - debug log "Hello, world!"`;

    // Generate config file
    const conf =
`${confName}:
  type: data
  enabled: true`;

    // Generate README file
    const readme = 
`# ${name}

${description}`;

    // Create directories
    const dirs = style.dirs;
    const hasDeps = !parsed["--no-deps"];

    if (hasDeps) dirs.push("deps");

    if (!parsed["--no-git"]) {
      // Initialize git repo
      exec("git init", (error, stdout, stderr) => {
        if (error) {
          cliError(error.message);
        }
      });
    
      if (hasDeps) fs.writeFileSync(`${cwd}/.gitignore`, "deps");
    }

    // Foreach directories
    dirs.forEach(async p => {
      try {
        fs.mkdirSync(`${cwd}/${p}`);
      } catch (err) {
        if (err.code === "EEXIST") return;
        cliError(err, true, false);
      }
    });

    // Create files
    fs.writeFileSync(`${cwd}/dzp.json`, dzp);
    fs.writeFileSync(`${cwd}/README.md`, readme);
    fs.writeFileSync(`${cwd}/LICENSE`, "");

    // Content
    fs.writeFileSync(
      `${cwd}/${style.main}${name}.dsc`, 
      style.config ? main : `${conf}\n\n${main}`
    );

    if (style.config) {
      fs.writeFileSync(`${cwd}/${style.config}config.dsc`, conf);
    }
  });