const fs = require("fs");
const readdirp = require("readdirp");
const eol = require("eol");

const cliError = require("./error.js");

function parseRules(arr) {
  const result = [];

  arr.every(l => {
    if (l.startsWith("#:")) {
      result.push(l);
      return true;
    } else return false;
  });

  const parsed = Object.assign({},
    ...result
      .filter(r => r.split("#:")[1].trim().startsWith("dzp-"))
      .map(r => r.split("#:")[1].trim())
      .map(r => {
        const cmd = r.split("dzp-")[1].trim();
        const [rule, ...args] = cmd.split(" ");

        return { [rule]: args };
      })
  );

  return parsed;
}

function groupScripts(arr) {
  const rules = parseRules(arr);
  arr.splice(0, rules.length);

  // if no args for ignore, just exit file
  // if no ignore, use empty array
  if (rules.ignore && rules.ignore.length < 1) return [];
  else if (!rules.ignore) rules.ignore = [];

  const result = [];
  let index = 0, times = 0;

  arr.forEach(l => {
    if ((l.startsWith(" ") || !l)) {
      if (!result[index]) return;
      result[index] = `${result[index]}\n${l}`;
    } else {
      if (!l || l.startsWith("#")) return;
      if (rules.ignore.includes(l.split(":")[0].trim())) return;

      if (times !== 0) index++;
      result[index] = l; times++;
    }
  });

  return result;
}

function trimWhitespace(arr) {
  while (!arr[arr.length - 1].trim()) arr.pop();
  return arr;
}

function parseScript(f) {
  return {
    path: f.path,
    name: f.data[0].includes(":") ? f.data[0].split(":")[0] : null,
    type: f.data[1].includes("type: ") ? f.data[1].split("type: ")[1] : null,
    data: trimWhitespace(f.data)
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
    const data = eol.lf(fs.readFileSync(p).toString());
    
    const scriptData = data; //.split("\n").filter(l => !l.trim().startsWith("#")).join("\n");
    const result = groupScripts(scriptData.split("\n"));

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