const fs = require("fs");

function updateDzp(path, obj) {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2));
}

module.exports = updateDzp;