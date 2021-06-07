const fs = require("fs");
const path = require("path");

const clone = require("./clone.js");
const getDzp = require("./getDzp.js");

const installed = [];

/**
 * Disclaimer: this is bad.
 * In the future, git support will be set aside in favor of a Denizen Forums API.
 * 
 * This whole cloning system is a mess, and super slow. For this small cli tool, whose main focus
 * is to provide directory setup and a small dependency system, it is fine for a first release.
 */

async function install(dir, url, proj, contents, update, here) {
  const folder = path.basename(url);
  const isInstalled = !installed.includes(url) && contents.includes(folder);
  const cloning = (isInstalled && update) || !isInstalled;

  if (cloning) {
    console.log(`${isInstalled && update 
      ? "Updating" 
      : "Installing"} "${url}"...`);
  }

  if (isInstalled && update) fs.rmSync(`${dir}/${folder}`, { recursive: true, force: true });
  if (cloning) await clone(url, dir);

  const dzp = getDzp(`${dir}/${folder}`, true);

  installed.push(url);

  if (!here) {
    if (!contents.includes(folder)) contents.push(folder);
    if (!proj.dependencies.includes(url)) proj.dependencies.push(url);
  }

  if (dzp.dependencies) dzp.dependencies.forEach(d => install(dir, d, proj, contents, update));
}

module.exports = install;