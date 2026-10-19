# Adel's Grimoire

A VS Code extension that explains SystemVerilog keywords and UVM names on hover. See [extension/README.md](extension/README.md) for the features.

## Layout

| Path | What it holds |
| --- | --- |
| `extension/` | The extension, with the built-in `sv` and `uvm` pages under `extension/library/` |
| `example/` | SystemVerilog and UVM files to try the hovers on |
| `tests/` | Lookup tests |
| `tools/` | Library checks and the hover animation generator |
| `ANIMATIONS.md` | Which words get an animation, grouped into families that share one design |

## Build and test

```shell
python3 tools/animate.py
python3 tools/check_library.py
node tests/lookup_test.js
cd extension
npx @vscode/vsce package --no-dependencies -o ../adels-grimoire.vsix
code --install-extension ../adels-grimoire.vsix
```

`tools/animate.py` rewrites every animation, so run it after changing the generator. Images in `extension/README.md`, such as demo GIFs, go in `extension/media/` and are linked with full URLs, `https://raw.githubusercontent.com/SincerelyAdel/grimoire-public/main/extension/media/<file>`. Relative links would be rewritten without the `extension/` folder and break. Push the images before publishing; `media/` is not packaged into the extension. To try the extension in Antigravity or another VS Code fork, use that editor's command line, such as `antigravity --install-extension`.

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

**Content.** The animation acts out the coding example as a loop of cases, one behavior per case (for `always_ff`: `d` reaches `q` only on `posedge clk`; `rst_n` low forces `q` to 0 with or without a clock). It shows only the circuit, its wires, the signal names and their values: no background, boxes around values, titles, captions or code. What counts as the circuit depends on the family: gates, registers and multiplexers for hardware; a waveform that draws itself left to right, after the signal name, for edge events; process and component boxes joined by wires for threads and UVM; a row of cycle cells per signal for assertions, filled gold in the cycles the signal is high. Which families exist, and which words use them, is in [ANIMATIONS.md](ANIMATIONS.md).

**Look.**

| | Dark themes | Light themes |
| --- | --- | --- |
| Lines | `#6B6B6B` | `#949494` |
| Text | `#F5F5F5` | `#0D0D0D` |
| Active wire | `#C9A227` | `#C9A227` |

- Transparent background, about 300 px wide, 13 px monospace text and 1.5 px lines, to sit at the size of the code example.
- The glow marks change: a wire flashes gold along its whole length, with a soft glow, whenever its own signal changes or an event or transaction passes along it, whether or not the change reaches an output. A box's outline lights while its process or component is active.
- A thread that runs for a while lights along its wire at a steady pace, in proportion to how long it runs.
- A waveform draws itself left to right over 5 s, and each edge the keyword reacts to glows as the drawing reaches it and stays lit until the loop fades: rising edges for `posedge`, falling edges for `negedge`, the whole wave for `edge`. A reset is drawn as a single pulse rather than a clock.
- Motion is designed with GSAP eases and baked into SVG animation, since hovers run no script: the light sweeps along the wire in 0.16 s with `power2.out`, holds, then fades in 0.45 s with `sine.out`.
