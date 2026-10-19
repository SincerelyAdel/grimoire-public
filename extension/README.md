# Adel's Grimoire

Explains SystemVerilog keywords and UVM names where you read them. Hover a word to see what it does, the rules that apply to it and a worked example, without leaving your code.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/SincerelyAdel/grimoire-public/main/extension/media/hover-1-dark.gif">
  <img alt="Hovering always_ff shows its description, a coding example and an animation of the flip-flop" src="https://raw.githubusercontent.com/SincerelyAdel/grimoire-public/main/extension/media/hover-1-light.gif">
</picture>

## Features

### Keyword help on hover

Hover any of the 248 SystemVerilog keywords, such as `always_ff`, `begin`, `constraint` or `throughout`, to see what it does, the rules that apply to it and a short example. Closing keywords lead to the keyword they close: `end` opens `begin`, `endmodule` opens `module`.

### UVM help on hover

Hover a UVM class, macro, method, phase or constant, such as `uvm_config_db`, `` `uvm_info ``, `build_phase` or `UVM_ACTIVE`, to see what it is, its declaration, a worked example and the usual pitfalls. Nearly 200 pages cover the base classes, phasing and objections, the factory, the configuration database, sequences, TLM, reporting, the register layer and the command-line options.

Variations lead to the right page: `` `uvm_do_with `` opens the `` `uvm_do `` page, `uvm_analysis_imp_wr` opens `` `uvm_analysis_imp_decl ``, and `pre_reset_phase` opens `reset_phase`.

UVM pages only appear in SystemVerilog files.

### Animated hovers

For 105 words, the hover ends with a short looping animation that acts out its code example. Each wire flashes gold the moment its signal changes, so you can watch cause and effect:

- **Registers and logic:** `always_ff` passes `d` to `q` only on a clock edge and clears it on reset; `always_comb`, `assign` and `always_latch` follow their inputs; the gates and tri-state gates cycle through their inputs.
- **Edges:** `posedge`, `negedge` and `edge` draw a waveform and light the edges they react to.
- **Processes:** `fork` with `join`, `join_any` and `join_none` runs its threads side by side; `event`, `wait` and `wait_order` show a blocked process waking up.
- **Branching:** `if`, `case`, `casez`, `unique` and `priority` light the branch that runs.
- **Assertions:** `assert`, `throughout`, `until`, `eventually` and others are checked cycle by cycle, once passing and once failing.
- **UVM:** the phase order, objections, the sequence to driver handshake, analysis ports, TLM FIFOs and active and passive agents.

Animations match your color theme, with separate versions for light and dark themes.

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

A library folder holds subfolders, and each subfolder holds one folder per word, named after it, with the page inside as `<name>/<name>.md`. A plain `<name>.md` file also works. List the library folder in `grimoire.libraryPaths`:

```json
"grimoire.libraryPaths": ["/path/to/my-library"]
```

- The `sv` and `uvm` subfolders apply only to SystemVerilog files.
- Any other subfolder applies everywhere.
- A page in your folders wins over a built-in page with the same name.
- The first line of a page is its title, written as ``**`name`** — summary``.
- A line of `---` draws a separator between parts of a page, such as the description, the code example and an animation, with space above and below it.
- Pages can show images, GIFs and animated SVGs saved next to them in the word's folder. Refer to the file by name with a markdown image, or with an HTML `img` tag when you want to set its `width`.
- To match light and dark themes, save two files with `.dark` and `.light` before the extension, and refer to the name without it. A page that shows `behavior.svg` gets `behavior.dark.svg` in dark and high contrast themes, and `behavior.light.svg` in light themes.

A subfolder can also hold an `aliases.json` file that points other names at an existing page. Keys are names or `*` globs, values are page names, and the first match wins:

```json
{
  "uvm_component_utils_end": "uvm_component_utils_begin",
  "uvm_analysis_imp_*": "uvm_analysis_imp_decl"
}
```

A page for the exact name always wins over an alias, and a leading backtick is ignored, so `` `uvm_info `` finds `uvm_info.md`.
