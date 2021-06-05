const fs = require("fs");
const path = require("path");

const cliError = require("./error.js");

async function uninstall(dir, pkg, proj) {
  const contents = fs.readdirSync(dir);
  const folder = path.basename(pkg);

  if (!contents.includes(folder)) {
    cliError(`dependency '${folder}' not found`);
  } else {
    console.log(`Uninstalling "${pkg}"...`);
    fs.rmSync(`${dir}/${folder}`, { recursive: true, force: true });
  }
}

module.exports = uninstall;