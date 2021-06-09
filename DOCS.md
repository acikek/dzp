# Advanced Documentation

## File Rules

You can have the script loader (used by the `script` and `readme` commands) interpret a file with special rules marked with **dzp comments**.

These comments are only seen as rules if they are put at the top of the file, consecutively, with no whitespace between them.

The syntax for these rules is as follows:

```yml
#: dzp-<rule> <args>
```

### `ignore`

An `ignore` rule tells the script loader to ignore certain scripts or the entire file.

```yml
#: dzp-ignore
#| the entire file is ignored

#: dzp-ignore my_script
#| only my_script is ignored

my_script:
  # ...
```

## dDoc

**dDoc** is a system of documentation formatted with human-readable comments linked above scripts. These are always specially loaded into scripts that are below the chain of comments as metadata. 

* Only comments outside of script bodies are loaded as dDoc comments.
* `#|` comments, as well as rule comments, are always ignored, no matter their placement.
* The amount of whitespace between the comments and a script does not matter.

dDoc comments consist of description and command lines. Description lines are treated as plain-text, and are loaded in no matter their placement in the comment system. Command lines have special types and syntax for each type.

Additionally, the commands and their respective types are stored in the `src/config.json` file. Below are the defaults:

```py
# Tags
@cmd

# Info
@cmd <description>

# Type
@cmd {type} <description>

# Full
@cmd {type} <name>: <description>
```

### Tags

* `deprecated`: Whether or not the script should be marked as deprecated.

### Info

> Info commands can include `$n` tokens to represent newlines.

* `usage`: An example of how to use the script in code or in-game.
* `uses`: A space-separated list of scripts that this script utilizes.

### Type

* `determine`: What a procedure determines.

### Full

> 'Full' commands are designed to be treated with multiple of them in mind. All 'full' commands are loaded into an array, meaning you can have as many as you want.

* `def`: A definition on the procedure or task.
* `key`: A script key on a task or data script.