// TODO This file needs to be split up.

const fs = require("fs");
const readdirp = require("readdirp");
const eol = require("eol");

const config = require("../config.json");

const cliError = require("./error.js");

const COMMENT = /#+ *(.+)/;
const METADATA = {
  CMD: /@(\S+)/, 
  INFO: /@\S+ (.+)/,
  TYPE: /@\S+ {(\S+)} (.+)/,
  FULL: /@\S+(?: {(\S+)}|) ([^:\n]+)(?: ?: ?(.+)|)/
};

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
      .map(r => r.split("#:")[1].trim())
      .filter(r => r && r.startsWith("dzp-"))
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
  arr.splice(0, Object.keys(rules).length);

  // if no args for ignore, just exit file
  // if no ignore, use empty array
  if (rules.ignore && rules.ignore.length < 1) return [];
  else if (!rules.ignore) rules.ignore = [];

  const result = [];
  let index = 0, times = 0, metadata = [];

  arr.forEach(l => {
    if ((l.startsWith(" "))) {
      if (!result[index]) return;

      metadata = [];
      result[index] = `${result[index]}\n${l}`;
    } else {
      if (!l || l.trim().startsWith("#|")) return;

      const isMetadata = l.startsWith("#") && (!result[index] || result[index].split("\n").filter(l => !l.startsWith("#")).length > 0);
      if (isMetadata) return metadata.push(l);
      
      // check ignored
      if (rules.ignore.includes(l.split(":")[0].trim())) {
        index++; return metadata = [];
      }

      if (times !== 0) index++;

      if (metadata.length > 0) result[index] = `${metadata.join("\n")}\n`;
      result[index] = result[index] ? `${result[index]}${l}` : l;

      times++;
    }
  });

  return result;
}

function trimWhitespace(arr) {
  while (!arr[arr.length - 1].trim()) arr.pop();
  return arr;
}

function parseMetadata(f) {
  const lines = [];

  f.every(l => {
    if (l.startsWith("#")) {
      lines.push(l);
      return true;
    } else return false;
  });

  const parsed = { desc: [] };

  lines
    .map(m => m.match(COMMENT)[1])
    .filter(m => m)
    .forEach(m => {
      const c = m.match(METADATA.CMD);

      if (c) {
        const cmd = c[1].toLowerCase();

        const typeEntry = config.ddoc.commands[cmd];
        const type = typeEntry ? typeEntry.toUpperCase() : "INFO";

        if (type === "TAG") return parsed[cmd] = true;

        const match = m.match(METADATA[type]);

        if (!match) return parsed.desc.push(m);
      
        const [dt, name, info] = match.slice(1, 4);
        if (!parsed[cmd]) parsed[cmd] = [];

        parsed[cmd].push({
          type: type === "INFO" ? dt.split("$n").join("\n") : dt,
          name,
          info
        });
      } else {
        parsed.desc.push(m);
      }
    });

  return parsed;
}

function parseScript(f) {
  const metadata = parseMetadata(f.data);
  const keyLen = Object.values(metadata).flat().length;

  f.data.splice(0, keyLen);

  return {
    ...f,
    name: f.data[0].includes(":") ? f.data[0].split(":")[0] : null,
    type: f.data[1].includes("type: ") ? f.data[1].split("type: ")[1] : null,
    data: trimWhitespace(f.data),
    metadata
  };
}

async function getScripts(find, flags) {
  const paths = [];
  const cwd = process.cwd();
  const dir = fs.readdirSync(cwd);

  if (!flags["--force"] && dir.includes("dzp-scripts.json")) {
    const data = JSON.parse(fs.readFileSync(`${cwd}/dzp-scripts.json`).toString());

    if (data.scripts) {
      if (find) {
        const s = data.scripts.find(s => s.name === find);
        if (!s) cliError("script does not exist");

        return s;
      }

      return data.scripts;
    }
  }

  const dirs = ["!.git"];
  if (flags["--no-deps"]) dirs.push("!deps");

  // This is an efficient method, according to the readdirp docs.
  for await (const file of readdirp(
    cwd, { 
      fileFilter: "*.dsc", 
      directoryFilter: dirs
    }
  )) {
    paths.push(file.path);
  }

  const files = paths.map(p => {
    const data = eol.lf(fs.readFileSync(p).toString());
    
    const scriptData = data.split("\n"); //.split("\n").filter(l => !l.trim().startsWith("#|"));
    const result = groupScripts(scriptData);

    if (!result) {
      cliError(`could not validate scripts in '${p}'`, true, false);
      return false;
    }

    return result.map(x => {
      const lines = x.split("\n");

      return { 
        path: p,
        data: lines
      }
    });
  })
  .filter(x => x)
  .flat();

  if (find) {
    const s = files.find(f => {
      return f.data
        .filter(l => l && !l.startsWith("#"))[0]
        .split(":")[0]
        .trim() === find;
    });

    if (!s) cliError("script does not exist");

    return parseScript(s);
  }

  const parsed = files.map(parseScript);

  if (flags["--save"]) {
    fs.writeFileSync(`${cwd}/dzp-scripts.json`, JSON.stringify({
      scripts: parsed
    }, null, 2));
  }

  return parsed;
}

module.exports = getScripts;