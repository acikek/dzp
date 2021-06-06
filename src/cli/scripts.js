const fs = require("fs");
const detectNewline = require("detect-newline");
const readdirp = require("readdirp");

const cliError = require("./error.js");

function groupScripts(arr) {
  const result = [];
  let index = 0, times = 0;

  arr.forEach(l => {
    if ((l.startsWith(" ") || !l) && !!result[index]) {
      result[index] = `${result[index]}\n${l}`;
    } else {
      if (!l) return;
      if (times !== 0) index++;
      result[index] = l; times++;
    }
  });

  return result;
}

function parseScript(f) {
  return {
    path: f.path,
    name: f.data[0].includes(":") ? f.data[0].split(":")[0] : null,
    type: f.data[1].includes("type: ") ? f.data[1].split("type: ")[1] : null,
    data: f.data
  };
}

async function getScripts(find) {
  const paths = [];

  // This is an efficient method, according to the readdirp docs.
  for await (const file of readdirp(
    process.cwd(), { 
      fileFilter: "*.dsc", 
      directoryFilter: ["!.git", "!deps"] 
    }
  )) {
    paths.push(file.path);
  }

  const files = paths.map(p => {
    const data = fs.readFileSync(p).toString();
    const eol = detectNewline(data);
    
    const scriptData = data.split(eol).filter(l => !l.trim().startsWith("#")).join(eol);
    const result = groupScripts(scriptData.split(eol));

    if (!result) {
      cliError(`could not validate scripts in '${p}'`, true, false);
      return false;
    }

    return result.map(x => {
      return { 
        path: p,
        data: x.split("\n")
      }
    });
  })
  .filter(x => x)
  .flat();

  if (find) {
    const s = files.find(f => f.data[0].split(":")[0].trim().toLowerCase() === find.toLowerCase());
    if (!s) cliError("script does not exist");

    return parseScript(s);
  }

  return files.map(parseScript);
}

module.exports = getScripts;