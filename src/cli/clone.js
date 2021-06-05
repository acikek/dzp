const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const util = require("util");

const cliError = require("./error");

async function clone(repo, p) {
  await util.promisify(exec)(`git clone ${repo} --depth 1`, {
    cwd: p
  }).then(_ => {
    fs.rmSync(`${p}/${path.basename(repo)}/.git`, { recursive: true, force: true });
  }).catch(err => {
    cliError(err.message);
  });
}

module.exports = clone;