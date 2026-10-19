"""Generate the library's hover animations, one dark and one light SVG each.

Each animation is SMIL only, since hovers show SVGs as images and run no script.
Motion is designed with GSAP eases and baked into keySplines:
  sweep = power2.out -> cubic-bezier(0.215, 0.61, 0.355, 1)
  fade  = sine.out   -> cubic-bezier(0.39, 0.575, 0.565, 1)

    python3 tools/animate.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIBRARY = ROOT / "extension" / "library"

PALETTES = {
    "dark": {"line": "#6B6B6B", "accent": "#C9A227", "text": "#F5F5F5"},
    "light": {"line": "#949494", "accent": "#C9A227", "text": "#0D0D0D"},
}
FONT = "Consolas, Menlo, monospace"
FONT_SIZE, STROKE, GLOW, BLUR = 13, 1.5, 4.5, 2.5  # sized to match the hover's code text
SWEEP, FADE, EPS = 0.16, 0.45, 0.001
LIN, OUT, SINE = "0 0 1 1", "0.215 0.61 0.355 1", "0.39 0.575 0.565 1"


class Canvas:
    def __init__(self, width, height, duration, palette):
        self.w, self.h, self.t, self.p = width, height, duration, palette
        self.parts = []

    def anim(self, attr, frames):
        """frames: [(t, value, spline into this frame)], the first at t=0."""
        if frames[-1][0] < self.t:
            frames = frames + [(self.t, frames[-1][1], LIN)]
        vals = ";".join(str(v) for _, v, _ in frames)
        times = ";".join(f"{t / self.t:.5f}" for t, _, _ in frames)
        splines = ";".join(s for _, _, s in frames[1:])
        return (f'<animate attributeName="{attr}" dur="{self.t:g}s" repeatCount="indefinite" calcMode="spline" '
                f'values="{vals}" keyTimes="{times}" keySplines="{splines}"/>')

    def add(self, svg):
        self.parts.append(svg)

    def wire(self, d, length, events):
        """A wire that sweeps gold with a glow for each (on, off) event."""
        dash, alpha = [(0, length, LIN)], [(0, 0, LIN)]
        for on, off in events:
            dash += [(on, length, LIN), (on + SWEEP, 0, OUT), (off + FADE, 0, LIN), (off + FADE + EPS, length, LIN)]
            alpha += [(on, 0, LIN), (on + EPS, 1, LIN), (off, 1, LIN), (off + FADE, 0, SINE)]
        sweep = self.anim("stroke-dashoffset", dash)
        accent = self.p["accent"]
        self.add(f'<path d="{d}" stroke="{self.p["line"]}" stroke-width="{STROKE}"/>')
        if events:
            self.add(f'<g opacity="0">{self.anim("opacity", alpha)}'
                     f'<path d="{d}" stroke="{accent}" stroke-width="{GLOW}" stroke-opacity="0.55" filter="url(#glow)" '
                     f'stroke-dasharray="{length}" stroke-dashoffset="{length}">{sweep}</path>'
                     f'<path d="{d}" stroke="{accent}" stroke-width="{STROKE}" '
                     f'stroke-dasharray="{length}" stroke-dashoffset="{length}">{sweep}</path></g>')

    def label(self, x, y, text, anchor="start"):
        self.add(f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{self.p["text"]}">{text}</text>')

    def values(self, x, y, spans):
        """Text that changes over time: spans = [(t0, t1, text)]."""
        for a, b, v in spans:
            frames = [(0, 1 if a == 0 else 0, LIN)]
            if a > 0:
                frames += [(a - EPS, 0, LIN), (a, 1, LIN)]
            if b < self.t:
                frames += [(b - EPS, 1, LIN), (b, 0, LIN)]
            self.add(f'<text x="{x}" y="{y}" text-anchor="middle" fill="{self.p["text"]}" opacity="{frames[0][1]}">'
                     f'{self.anim("opacity", frames)}{v}</text>')

    def svg(self):
        return "\n".join([
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
            f'font-family="{FONT}" font-size="{FONT_SIZE}" fill="none" stroke-linecap="round" stroke-linejoin="round">',
            f'<defs><filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="{self.w}" height="{self.h}">'
            f'<feGaussianBlur stdDeviation="{BLUR}"/></filter></defs>',
            *self.parts,
            "</svg>",
        ]) + "\n"


def always_ff(palette):
    """Case 1: q takes d only on posedge clk. Case 2: rst_n low forces q to 0, clock or not."""
    c = Canvas(300, 122, 10.0, palette)
    edges = [2.0, 4.5, 7.5]
    captures = [2.0, 4.5]
    reset = (5.5, 8.5)
    clk_ev = [(t, t + 0.25) for t in edges]
    d_ev = [(t + 0.10, t + 0.40) for t in captures]
    q_ev = [(t + 0.22, t + 0.55) for t in captures] + [(reset[0] + 0.10, reset[0] + 0.45)]
    line = f'stroke="{palette["line"]}" stroke-width="{STROKE}"'

    c.add(f'<rect x="120" y="18" width="60" height="56" rx="3" {line}/>')
    c.wire("M120 55L129 62L120 69", 23, clk_ev)
    c.add(f'<circle cx="150" cy="78" r="3.5" {line}/>')
    c.wire("M36 32H120", 84, d_ev)
    c.wire("M36 62H120", 84, clk_ev)
    c.wire("M180 32H264", 84, q_ev)
    c.wire("M150 114V81.5", 33, [reset])

    c.label(28, 36, "d", "end")
    c.label(28, 66, "clk", "end")
    c.label(272, 36, "q")
    c.label(158, 117, "rst_n")
    c.values(78, 24, [(0, 1, "3"), (1, 3.5, "5"), (3.5, 6.5, "A"), (6.5, c.t, "7")])
    c.values(222, 24, [(0, 2.35, "0"), (2.35, 4.85, "5"), (4.85, reset[0] + 0.2, "A"), (reset[0] + 0.2, c.t, "0")])
    return c.svg()


# <subfolder>/<tag>/<animation>: the page refers to it as <animation>.svg
ANIMATIONS = {
    "sv/always_ff/behavior": always_ff,
}


def main():
    for target, draw in ANIMATIONS.items():
        for theme, palette in PALETTES.items():
            out = LIBRARY / f"{target}.{theme}.svg"
            out.write_text(draw(palette), encoding="utf-8", newline="\n")
            print(f"wrote {out.relative_to(ROOT).as_posix()}")


if __name__ == "__main__":
    main()
