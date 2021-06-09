const arg = require("arg");
const cliError = require("./error.js");

function parseArgs(argv) {
  try {
    return arg(
      {
        // Arguments
        "--data":         Boolean,
        "--help":         Boolean,
        "--here":         Boolean,
        "--json":         Boolean,
        "--list":         Boolean,
        "--no-deps":      Boolean,
        "--no-git":       Boolean,
        // "--save":         Boolean,
        "--spacing":      Number,
        "--style":        String,
        "--usage":        Boolean,
        "--use":          String,
        "--update":       Boolean,
        "--version":      Boolean,
  
        // Aliases
        "-h": "--help",
        "-u": "--usage",
        "-v": "--version"
      },
      {
        argv
      }
    );
  } catch (err) {
    cliError(err.message);
  }
}

module.exports = parseArgs;