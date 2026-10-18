# Adel's Grimoire

A VS Code extension that explains SystemVerilog keywords and UVM names on hover, and shows Jasper CDC/RDC and Superlint violations as squiggles. See [extension/README.md](extension/README.md) for the features.

## Layout

| Path | What it holds |
| --- | --- |
| `extension/` | The extension, with the built-in `sv` and `uvm` pages under `extension/library/` |
| `example/` | SystemVerilog and UVM files to try the hovers on |
| `tests/` | Lookup tests |
| `tools/` | Packaging and library checks |

## Build and test

```shell
python3 tools/check_library.py
node tests/lookup_test.js
python3 tools/build_vsix.py
code --install-extension adels-grimoire-1.0.0.vsix
```
