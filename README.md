# Adel's Grimoire

A VS Code extension that explains SystemVerilog keywords and UVM names on hover. See [extension/README.md](extension/README.md) for the features.

## Layout

| Path | What it holds |
| --- | --- |
| `extension/` | The extension, with the built-in `sv` and `uvm` pages under `extension/library/` |
| `example/` | SystemVerilog and UVM files to try the hovers on |
| `tests/` | Lookup tests |
| `tools/` | Library checks |

## Build and test

```shell
python3 tools/check_library.py
node tests/lookup_test.js
cd extension
npx @vscode/vsce package --no-dependencies -o ../adels-grimoire-1.0.0.vsix
code --install-extension ../adels-grimoire-1.0.0.vsix
```
