<div align="center">
  <br/>
  <p>
    <img src="https://imgur.com/GZwNotP.png" width="400" alt="ruqqus-js"/></a>
  </p>
</div>

## About

DeniZip `(dzp)`, the Denizen Project Manager, is a command-line tool that aids in the creation of [DenizenScript](https://denizenscript.com) projects.

### Features

- Intuitive interface
- Customizable
- Multiple styles
- Dependency manager
- Efficient, lightweight

## Setup

**Requires Node.js v12 or newer.**<br>
Install the package globally:
```sh
npm install dzp -g
```
## Example

Make a new directory for your project - it works in the Denizen plugin's `scripts` folder too!
```sh
mkdir fiery && cd fiery
```
Run `dzp new`, and enter the corresponding values for the prompts.
```sh
project name: Fiery
acronym: fy
description: Set anything on fire
version: (1.0.0)
repository: https://github.com/cool_guy78/fiery
author: cool_guy78
```
In your directory, you'll see the following directory tree appear:
```txt
deps/
src/
├─ data/
│  ├─ config.dsc
├─ main/
│  ├─ fiery.dsc
├─ util/
.gitignore
dzp.json
LICENSE
README.md
```
> If you're going for a one-file project, try using the `--style drop-in` flag.

The Denizen files and README are pre-fitted with boilerplate code, and the `dzp.json` file holds the information that you entered upon initialization.

## Commands

View all commands with `dzp help --usage`.<br>
To view a specific command and its extended description, run `dzp <command> --help`.

### `get`
**Usage**: `dzp get <key>`<br>
Retrieves a project config value.

### `help`
**Usage**: `dzp help [--usage]`<br>
Displays the help message.

### `install`
**Usage**: `dzp install [<repo>] [--update]`<br>
Installs a dependency chain.

### `new`
**Usage**: `dzp new [--style <style>] [--spacing <spaces>] [--no-deps] [--no-git]`<br>
Creates a new DeniZip project.

### `readme`
**Usage**: `dzp readme [--json] [--use <path>]`
Generates a README file.

### `script`
**Usage**: `dzp script [<name>] [--list] [--data]`<br>
Finds info about a script.

### `set`
**Usage**: `dzp set <key> <value>`<br>
Updates a project config value.

### `style`
**Usage**: `dzp style [<name>]`<br>
Lists the loaded style names.

### `uninstall`
**Usage**: `dzp uninstall <name>`<br>
Uninstalls a dependency.

## License
MIT © 2021 Kyle Prince
