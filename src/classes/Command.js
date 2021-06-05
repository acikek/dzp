class Command {
  constructor(name, desc, usage, help) {
    this.name = name;
    this.desc = desc;
    this.usage = usage;
    this.help = help;

    this._exec = function() {
      console.log("Hello, world!");
    }
  }

  setExec(func) {
    this._exec = func;
    return this;
  }

  exec(parsed, args) {
    this._exec(parsed, ...args);
  }

  getHelp() {
    return `dzp ${this.name} ${this.usage}

${this.desc}.${this.help ? `

${this.help}` : ""}`;
  }
}

module.exports = Command;