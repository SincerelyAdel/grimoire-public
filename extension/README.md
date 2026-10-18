# Adel's Grimoire

Explains SystemVerilog keywords and UVM names where you read them, and puts Jasper CDC/RDC and Superlint violations on the lines that caused them.

## Features

### Keyword help on hover

Hover any of the 248 SystemVerilog keywords, such as `always_ff`, `begin`, `constraint` or `throughout`, to see what it does, the rules that apply to it and a short example. Closing keywords lead to the keyword they close: `end` opens `begin`, `endmodule` opens `module`.

### UVM help on hover

Hover a UVM class, macro, method, phase or constant, such as `uvm_config_db`, `` `uvm_info ``, `build_phase` or `UVM_ACTIVE`, to see what it is, its declaration, a worked example and the usual pitfalls. Nearly 200 pages cover the base classes, phasing and objections, the factory, the configuration database, sequences, TLM, reporting, the register layer and the command-line options.

Variations lead to the right page: `` `uvm_do_with `` opens the `` `uvm_do `` page, `uvm_analysis_imp_wr` opens `` `uvm_analysis_imp_decl ``, and `pre_reset_phase` opens `reset_phase`.

UVM pages only appear in SystemVerilog files.

### Violations in your code

After a Jasper CDC/RDC or Superlint run, every violation appears as a squiggle on the signal or line it is about, and as an entry in the Problems panel.

- Errors, warnings and infos keep the severity Jasper gave them. Fatal violations show as errors, with `Fatal:` at the start of the message.
- The list refreshes by itself when you rerun Jasper.
- Each entry names its origin: `jasper(TAG)` for CDC/RDC and `superlint(TAG)` for Superlint.
- If you add pages for Jasper tags to your own library, hovering a squiggle shows the tag's page too, and the tag in the Problems panel opens it.

### Your own pages

Add a folder of Markdown pages and they appear on hover next to the built-in ones, in any language. In `.tcl` and `.def` files, completion suggests every page name with its one-line summary.

## Setup

1. Install the [Slang extension](https://marketplace.visualstudio.com/items?itemName=hudson-river-trading.vscode-slang), which Grimoire requires.
2. Install Adel's Grimoire.

The SystemVerilog and UVM pages are built in, so hover help works straight away.

## Getting started with violations

Have Jasper write its report into a `reports` folder anywhere in your workspace:

| App | File | Jasper command |
| --- | --- | --- |
| CDC/RDC | `reports/violations.csv` | `check_cdc -list violations -file reports/violations.csv -force` |
| Superlint | `reports/superlint.csv` | `check_superlint -report -violation -detailed -file reports/superlint.csv -csv -force` |

## Settings

| Setting | Default | What it does |
| --- | --- | --- |
| `grimoire.libraryPaths` | `[]` | Extra documentation folders, searched before the built-in pages. |
| `grimoire.reportGlob` | `**/reports/{violations,superlint}.csv` | Where to look for Jasper violation reports. Leave empty to turn squiggles off. |

## Adding your own pages

A library folder holds subfolders, and each subfolder holds one `<name>.md` file per word. List the folder in `grimoire.libraryPaths`:

```json
"grimoire.libraryPaths": ["/path/to/my-library"]
```

- The `sv` and `uvm` subfolders apply only to SystemVerilog files.
- The `params` subfolder applies only to `.tcl`, `.def` and `.sdc` files. A page named `<TAG>.<param>.md` answers a hover on `param` inside `params TAG {...}`.
- Any other subfolder applies everywhere.
- A page in your folders wins over a built-in page with the same name.
- The first line of a page is its title, written as ``**`name`** — summary``.

A subfolder can also hold an `aliases.json` file that points other names at an existing page. Keys are names or `*` globs, values are page names, and the first match wins:

```json
{
  "uvm_component_utils_end": "uvm_component_utils_begin",
  "uvm_analysis_imp_*": "uvm_analysis_imp_decl"
}
```

A page for the exact name always wins over an alias, and a leading backtick is ignored, so `` `uvm_info `` finds `uvm_info.md`.

## Commands

| Command | What it does |
| --- | --- |
| **Grimoire: Reload CDC/RDC Reports** | Rereads the violation reports now, Superlint included. |

## If violations do not show up

Open the **Grimoire** output channel. It says how many reports and violations were found, and which violations could not be matched to a module or file in your workspace.
