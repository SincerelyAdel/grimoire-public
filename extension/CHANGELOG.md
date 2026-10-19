# Changelog

## 1.0.4

- 105 words now end their hover with an animation of their coding example: registers, gates, processes, `fork`/`join`, branching, assertions, and the UVM phases, objections, sequence-driver handshake, analysis ports, FIFOs and agents.
- `posedge`, `negedge` and `edge` draw a waveform that lights the edges they react to.
- Each wire in an animation flashes when its signal changes.
- The Repository and Issues links are back.

## 1.0.3

- Hover pages can show images, GIFs and animated SVGs, with separate files for light and dark themes.
- A `---` line splits a page into spaced sections.
- Each page now lives in its own folder, next to its images; flat `<name>.md` pages in your own libraries still work.
- `always_ff` shows an animation of its behaviour.

## 1.0.2

- Adel's Grimoire is now purely a documentation extension: violation-report squiggles were removed, along with the `grimoire.reportGlob` setting and the reload command.
- Removed the Repository and Issues links; use the Marketplace Q&A tab for questions.

## 1.0.1

- Pages for every SystemVerilog keyword: 229 pages, up from 41, covering control flow, types and nets, classes, randomization, coverage, assertions, configurations, gate primitives and drive strengths.
- Closing keywords open the page of the keyword they close, so `end` opens `begin` and `endmodule` opens `module`.
- Pages whose names differ only in letter case were renamed, so the extension installs correctly on Windows and macOS.
- Clearer Marketplace description.

## 1.0.0

- First public release.
- Hover documentation for SystemVerilog keywords and UVM (192 pages), built in.
- Name variations and `*` globs share a page through `aliases.json`.
- `grimoire.libraryPaths` adds your own documentation folders.
