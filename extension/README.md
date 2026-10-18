# Adel's Grimoire

Explains SystemVerilog keywords and UVM names where you read them. Hover a word to see what it does, the rules that apply to it and a worked example, without leaving your code.

## Features

### Keyword help on hover

Hover any of the 248 SystemVerilog keywords, such as `always_ff`, `begin`, `constraint` or `throughout`, to see what it does, the rules that apply to it and a short example. Closing keywords lead to the keyword they close: `end` opens `begin`, `endmodule` opens `module`.

### UVM help on hover

Hover a UVM class, macro, method, phase or constant, such as `uvm_config_db`, `` `uvm_info ``, `build_phase` or `UVM_ACTIVE`, to see what it is, its declaration, a worked example and the usual pitfalls. Nearly 200 pages cover the base classes, phasing and objections, the factory, the configuration database, sequences, TLM, reporting, the register layer and the command-line options.

Variations lead to the right page: `` `uvm_do_with `` opens the `` `uvm_do `` page, `uvm_analysis_imp_wr` opens `` `uvm_analysis_imp_decl ``, and `pre_reset_phase` opens `reset_phase`.

UVM pages only appear in SystemVerilog files.

### Your own pages

Add a folder of Markdown pages, such as your team's coding rules or notes on in-house IP, and they appear on hover next to the built-in ones.

## Setup

1. Install the [Slang extension](https://marketplace.visualstudio.com/items?itemName=hudson-river-trading.vscode-slang), which Grimoire requires.
2. Install Adel's Grimoire.

The SystemVerilog and UVM pages are built in, so hover help works straight away.

## Settings

| Setting | Default | What it does |
| --- | --- | --- |
| `grimoire.libraryPaths` | `[]` | Extra documentation folders, searched before the built-in pages. |

## Adding your own pages

A library folder holds subfolders, and each subfolder holds one `<name>.md` file per word. List the folder in `grimoire.libraryPaths`:

```json
"grimoire.libraryPaths": ["/path/to/my-library"]
```

- The `sv` and `uvm` subfolders apply only to SystemVerilog files.
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
