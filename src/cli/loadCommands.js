const fs = require("fs");

function loadCommands() {
  const dir = `${__dirname}/../commands`;

  return Object.assign({}, 
    ...fs.readdirSync(dir)
      .map(n => ({ [n.split(".js")[0]]: require(`${dir}/${n}`) }))
  );
}

module.exports = loadCommands;