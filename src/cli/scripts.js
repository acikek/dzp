// TODO This file needs to be split up.

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

// todo put this in a config
const COMMENT = /#+ *(.+)/;
const METADATA = {
  CMD: /@(\S+)/, 
  INFO: /@\S+ (.+)/,
  TYPE: /@\S+ {(\S+)} (.+)/,
  FULL: /@\S+(?: {(\S+)}|) ([^:\n]+)(?: ?: ?(.+)|)/
};

const COMMANDS = Object.entries({
  TAG: [ "deprecated" ],
  INFO: [ "usage", "uses" ],
  TYPE: [ "determine" ],
  FULL: [ "def", "key" ]
});

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

        const typeEntry = COMMANDS.filter(c => c[1].includes(cmd));
        const type = typeEntry.length < 1 ? "INFO" : typeEntry[0][0];

        if (type === "TAG") return parsed[cmd] = true;

        const match = m.match(METADATA[type]);

        if (!match) return;
      
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

  return parsed;
}

module.exports = getScripts;