# Adel's Grimoire

A VS Code extension that explains SystemVerilog keywords and UVM names on hover. See [extension/README.md](extension/README.md) for the features.

## Layout

| Path | What it holds |
| --- | --- |
| `extension/` | The extension, with the built-in `sv` and `uvm` pages under `extension/library/` |
| `example/` | SystemVerilog and UVM files to try the hovers on |
| `tests/` | Lookup tests |
| `tools/` | Library checks and the hover animation generator |

## Build and test

```shell
python3 tools/animate.py
python3 tools/check_library.py
node tests/lookup_test.js
cd extension
npx @vscode/vsce package --no-dependencies -o ../adels-grimoire-1.0.0.vsix
code --install-extension ../adels-grimoire-1.0.0.vsix
```

## Animated pages

Every page with an animation follows the `always_ff` page (`extension/library/sv/always_ff/`). `tools/check_library.py` enforces the page layout.

**Page layout.** Three parts, separated by `---` lines:

```markdown
**`name`** — summary

Description.

---

**Coding example**

(a systemverilog code block)

---

**Visual**

<img src="behavior.svg" width="300">
```

**Files.** The page and its animation live in the word's folder. Each animation is a function in `tools/animate.py`, listed in `ANIMATIONS`, and the script writes `<animation>.dark.svg` and `<animation>.light.svg`. The page refers to `<animation>.svg`, and the hover picks the file for the current theme.

**Content.** The animation acts out the coding example as a loop of cases, one behavior per case (for `always_ff`: `d` reaches `q` only on `posedge clk`; `rst_n` low forces `q` to 0 with or without a clock). It shows only the circuit, its wires, the signal names and their values: no background, boxes around values, titles, captions or code.

**Look.**

| | Dark themes | Light themes |
| --- | --- | --- |
| Lines | `#6B6B6B` | `#949494` |
| Text | `#F5F5F5` | `#0D0D0D` |
| Active wire | `#C9A227` | `#C9A227` |

- Transparent background, about 300 px wide, 13 px monospace text and 1.5 px lines, to sit at the size of the code example.
- A wire lights up gold only while it is carrying a value or event, along its whole length, with a soft glow.
- Motion is designed with GSAP eases and baked into SVG animation, since hovers run no script: the light sweeps along the wire in 0.16 s with `power2.out`, holds, then fades in 0.45 s with `sine.out`.
