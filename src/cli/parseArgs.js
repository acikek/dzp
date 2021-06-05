const arg = require("arg");
const cliError = require("./error.js");

function parseArgs(argv) {
  try {
    return arg(
      {
        // Arguments
        "--help":         Boolean,
        "--version":      Boolean,
        "--json-spacing": Number,
        "--use-style":    String,
        "--no-deps":      Boolean,
        "--usage":        Boolean,
        "--update":       Boolean,
  
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