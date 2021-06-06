const arg = require("arg");
const cliError = require("./error.js");

function parseArgs(argv) {
  try {
    return arg(
      {
        // Arguments
        "--help":         Boolean,
        "--version":      Boolean,
        "--spacing":      Number,
        "--style":        String,
        "--json":         Boolean,
        "--use":          String,
        "--list":         Boolean,
        "--no-deps":      Boolean,
        "--no-git":       Boolean,
        "--usage":        Boolean,
        "--update":       Boolean,
        "--data":         Boolean,
  
        // Aliases
        "-h": "--help",
        "-v": "--version",
        "-u": "--usage"
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