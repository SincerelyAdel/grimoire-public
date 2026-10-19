"""Generate the library's hover animations, one dark and one light SVG each.

Each animation is SMIL only, since hovers show SVGs as images and run no script.
Motion is designed with GSAP eases and baked into keySplines:
  sweep = power2.out -> cubic-bezier(0.215, 0.61, 0.355, 1)
  fade  = sine.out   -> cubic-bezier(0.39, 0.575, 0.565, 1)
A thread that runs for a while lights along its wire at a steady pace instead.

Words in one family share a drawing function; ANIMATIONS at the bottom gives
each page its own arguments, taken from that page's coding example.

    python3 tools/animate.py
"""
from functools import partial
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIBRARY = ROOT / "extension" / "library"

PALETTES = {
    "dark": {"line": "#6B6B6B", "accent": "#C9A227", "text": "#F5F5F5"},
    "light": {"line": "#949494", "accent": "#C9A227", "text": "#0D0D0D"},
}
FONT = "Consolas, Menlo, monospace"
FONT_SIZE, STROKE, GLOW, BLUR = 13, 1.5, 4.5, 2.5  # sized to match the hover's code text
CHAR = 7.8  # width of one character at FONT_SIZE
W = 300
SWEEP, FADE, EPS = 0.16, 0.45, 0.001
LIN, OUT, SINE = "0 0 1 1", "0.215 0.61 0.355 1", "0.39 0.575 0.565 1"


def merge(events):
    """Sort (on, off[, duration, reach]) events and join any that would overlap a fade."""
    out = []
    for ev in sorted(tuple(e) for e in events):
        if out and ev[0] <= out[-1][1] + FADE + 3 * EPS:
            out[-1] = (out[-1][0], max(out[-1][1], ev[1])) + out[-1][2:]
        else:
            out.append(ev)
    return out


def spans(steps, end):
    """[(t, value)] starting at t=0 -> [(t0, t1, value)]."""
    return [(t, steps[i + 1][0] if i + 1 < len(steps) else end, v) for i, (t, v) in enumerate(steps)]


class Canvas:
    def __init__(self, height, duration, palette, width=W):
        self.w, self.h, self.t, self.p = width, height, duration, palette
        self.line, self.accent, self.text = palette["line"], palette["accent"], palette["text"]
        self.parts = []

    # ---- animation plumbing ----

    def anim(self, attr, frames):
        """frames: [(t, value, spline into this frame)], the first at t=0."""
        if frames[-1][0] < self.t:
            frames = frames + [(self.t, frames[-1][1], LIN)]
        times = [t for t, _, _ in frames]
        assert times[0] == 0 and all(b > a for a, b in zip(times, times[1:])) and times[-1] <= self.t + 1e-9, times
        vals = ";".join(str(v) for _, v, _ in frames)
        keys = ";".join(f"{t / self.t:.5f}" for t in times)
        splines = ";".join(s for _, _, s in frames[1:])
        return (f'<animate attributeName="{attr}" dur="{self.t:g}s" repeatCount="indefinite" calcMode="spline" '
                f'values="{vals}" keyTimes="{keys}" keySplines="{splines}"/>')

    def alpha(self, events):
        frames = [(0, 0, LIN)]
        for on, off, *_ in events:
            frames += [(on, 0, LIN), (on + EPS, 1, LIN), (off, 1, LIN), (off + FADE, 0, SINE)]
        return self.anim("opacity", frames)

    def clip(self, events):
        """Keep events inside the loop: start after 0, finish fading before the end."""
        out = []
        for on, off, *rest in merge(events):
            on, off = max(on, 2 * EPS), min(off, self.t - FADE - 2 * EPS)
            if off > on:
                out.append((on, off, *rest))
        return out

    def add(self, svg):
        self.parts.append(svg)

    def glow(self, markup, events):
        """Gold copy of an element, with a soft glow, shown while events are on."""
        events = self.clip(events)
        if events:
            soft = markup.format(stroke=self.accent, width=GLOW).replace("/>", ' stroke-opacity="0.55" filter="url(#glow)"/>', 1)
            self.add(f'<g opacity="0">{self.alpha(events)}{soft}{markup.format(stroke=self.accent, width=STROKE)}</g>')

    # ---- drawing ----

    def wire(self, d, length, events=(), base=True):
        """A wire that sweeps gold along its length for each (on, off[, duration, reach]) event.
        base=False draws only the gold, over a line drawn some other way."""
        if base:
            self.add(f'<path d="{d}" stroke="{self.line}" stroke-width="{STROKE}"/>')
        events = self.clip(events)
        if not events:
            return
        dash = [(0, length, LIN)]
        for on, off, *rest in events:
            dur = rest[0] if rest else SWEEP
            reach = rest[1] if len(rest) > 1 else 1.0
            end = round(length * (1 - reach), 2)
            dash += [(on, length, LIN), (on + min(dur, off - on), end, OUT if dur == SWEEP else LIN),
                     (off + FADE, end, LIN), (off + FADE + EPS, length, LIN)]
        sweep = self.anim("stroke-dashoffset", dash)
        self.add(f'<g opacity="0">{self.alpha(events)}'
                 f'<path d="{d}" stroke="{self.accent}" stroke-width="{GLOW}" stroke-opacity="0.55" filter="url(#glow)" '
                 f'stroke-dasharray="{length}" stroke-dashoffset="{length}">{sweep}</path>'
                 f'<path d="{d}" stroke="{self.accent}" stroke-width="{STROKE}" '
                 f'stroke-dasharray="{length}" stroke-dashoffset="{length}">{sweep}</path></g>')

    def shape(self, markup, events=()):
        """An outline (markup with {stroke} and {width}) that lights gold while events are on."""
        self.add(markup.format(stroke=self.line, width=STROKE))
        self.glow(markup, events)

    def box(self, x, y, w, h, name=None, events=()):
        self.shape(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="3" stroke="{{stroke}}" stroke-width="{{width}}"/>', events)
        if name:
            self.label(x + w / 2, y + h / 2 + 4.5, name, "middle")

    def cell(self, x, y, w, h, events=()):
        """A square that fills gold while events are on."""
        self.add(f'<rect x="{x:.1f}" y="{y}" width="{w:.1f}" height="{h}" rx="2" stroke="{self.line}" stroke-width="{STROKE}"/>')
        events = self.clip(events)
        if events:
            rect = f'<rect x="{x:.1f}" y="{y}" width="{w:.1f}" height="{h}" rx="2" fill="{self.accent}"'
            self.add(f'<g opacity="0">{self.alpha(events)}{rect} fill-opacity="0.55" filter="url(#glow)"/>{rect}/></g>')

    def dot(self, x, y, r=2.5):
        self.add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{self.line}"/>')

    def label(self, x, y, text, anchor="start"):
        self.add(f'<text x="{x:g}" y="{y:g}" text-anchor="{anchor}" fill="{self.text}">{text}</text>')

    def values(self, x, y, steps, anchor="middle"):
        """Text that changes over time: steps = [(t, text)] starting at t=0."""
        for a, b, v in spans(steps, self.t):
            frames = [(0, 1 if a == 0 else 0, LIN)]
            if a > 0:
                frames += [(a - EPS, 0, LIN), (a, 1, LIN)]
            if b < self.t:
                frames += [(b - EPS, 1, LIN), (b, 0, LIN)]
            self.add(f'<text x="{x:g}" y="{y:g}" text-anchor="{anchor}" fill="{self.text}" opacity="{frames[0][1]}">'
                     f'{self.anim("opacity", frames)}{v}</text>')

    def dim(self, start, dims):
        """Fade everything drawn since `start` to a ghost during each (t0, t1) span."""
        frames = [(0, 1, LIN)]
        for a, b in dims:
            frames += [(a, 1, LIN), (a + 0.5, 0.15, SINE), (b, 0.15, LIN), (min(b + 0.5, self.t), 1, SINE)]
        inner = "".join(self.parts[start:])
        del self.parts[start:]
        self.add(f'<g>{self.anim("opacity", frames)}{inner}</g>')

    def svg(self):
        return "\n".join([
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
            f'font-family="{FONT}" font-size="{FONT_SIZE}" fill="none" stroke-linecap="round" stroke-linejoin="round">',
            f'<defs><filter id="glow" filterUnits="userSpaceOnUse" x="0" y="0" width="{self.w}" height="{self.h}">'
            f'<feGaussianBlur stdDeviation="{BLUR}"/></filter></defs>',
            *self.parts,
            "</svg>",
        ]) + "\n"


def changes(steps, length=0.3):
    """Flash at every change of value. The jump back when the loop restarts does not count."""
    return [(t, t + length) for (t, v), (_, prev) in zip(steps[1:], steps) if v != prev]


def flash(times, length=0.25, delay=0.0):
    return [(t + delay, t + delay + length) for t in times]


# ===================================================================== SystemVerilog


def flop(palette, reset=True, enable=None):
    """always_ff-style register. Case 1: q takes d only on posedge clk.
    reset: case 2, rst_n low forces q to 0 with or without a clock.
    enable: a qualifier name (iff); edges while it is 0 do not wake the block.
    Every wire flashes when its own signal changes; the clock pin flashes when an edge wakes the block."""
    if reset:
        c = Canvas(122, 10.0, palette)
        edges, captures = [2.0, 4.5, 7.5], [2.0, 4.5]
        rst_steps = [(0, "1"), (5.5, "0"), (8.5, "1")]
        d_steps = [(0, "3"), (1, "5"), (3.5, "A"), (6.5, "7")]
        q_steps = [(0, "0"), (2.35, "5"), (4.85, "A"), (5.7, "0")]
    else:
        c = Canvas(122 if enable else 90, 8.0, palette)
        edges = [1.0, 3.0, 5.0, 7.0]
        d_steps = [(0, "3"), (2.2, "5"), (5.6, "A")]
        if enable:
            en_steps = [(0, "1"), (4.0, "0")]
            captures = [1.0, 3.0]
            q_steps = [(0, "5"), (1.35, "3"), (3.35, "5")]
        else:
            captures = edges
            q_steps = [(0, "A"), (1.35, "3"), (3.35, "5"), (7.35, "A")]
    clk_steps = [(0, "0")] + [x for t in edges for x in ((t, "1"), (t + 1.0, "0")) if x[0] < c.t]
    c.box(120, 18, 60, 56)
    c.wire("M120 55L129 62L120 69", 23, flash(captures))
    c.wire("M36 32H120", 84, changes(d_steps))
    c.wire("M36 62H120", 84, changes(clk_steps, 0.25))
    c.wire("M180 32H264", 84, changes(q_steps))
    c.label(28, 36, "d", "end")
    c.label(28, 66, "clk", "end")
    c.label(272, 36, "q")
    c.values(78, 24, d_steps)
    c.values(78, 54, clk_steps)
    c.values(222, 24, q_steps)
    if reset:
        c.add(f'<circle cx="150" cy="78" r="3.5" stroke="{c.line}" stroke-width="{STROKE}"/>')
        c.wire("M150 114V81.5", 33, changes(rst_steps))
        c.label(158, 117, "rst_n")
        c.values(158 + 5 * CHAR + 10, 117, rst_steps, "start")
    if enable:
        c.wire("M150 114V74", 40, changes(en_steps))
        c.label(158, 117, enable)
        c.values(158 + len(enable) * CHAR + 10, 117, en_steps, "start")
    return c.svg()


def waveform(palette, name, glow, pulse_at=None):
    """A square wave that draws itself left to right after the signal name.
    glow: "rise" lights each rising edge as it is drawn, "fall" each falling edge, "all" the whole wave.
    pulse_at: instead of a clock, stay high with one low pulse starting at this fraction of the width."""
    c = Canvas(60, 7.5, palette)
    start, draw, hold = 0.3, 5.0, 6.8
    hi, lo = 16, 44
    x0 = 18 + len(name) * CHAR
    hw = (290 - x0) / 8
    if pulse_at is None:
        y, flips = lo, [x0 + hw / 2 + i * hw for i in range(8)]
    else:
        fall = x0 + pulse_at * (290 - x0)
        y, flips = hi, [fall, fall + hw]
    # the wave as segments: (x1, y1, x2, y2)
    start_y, segs, x = y, [], x0
    for fx in flips:
        segs.append((x, y, fx, y))
        ny = hi if y == lo else lo
        segs.append((fx, y, fx, ny))
        x, y = fx, ny
    segs.append((x, y, 290, y))
    length = sum(abs(x2 - x1) + abs(y2 - y1) for x1, y1, x2, y2 in segs)
    d = f"M{x0:.1f} {start_y}" + "".join(f"L{x2:.1f} {y2}" for _, _, x2, y2 in segs)
    reveal = c.anim("stroke-dashoffset", [(0, length, LIN), (start, length, LIN), (start + draw, 0, LIN),
                                          (c.t - 0.2, 0, LIN), (c.t - 0.2 + EPS, length, LIN)])
    fade = c.anim("opacity", [(0, 1, LIN), (hold, 1, LIN), (hold + FADE, 0, SINE)])
    c.add(f'<path d="{d}" stroke="{c.line}" stroke-width="{STROKE}" stroke-dasharray="{length:.1f}" '
          f'stroke-dashoffset="{length:.1f}">{reveal}{fade}</path>')
    if glow == "all":
        c.wire(d, round(length, 1), [(start, hold, draw)], base=False)
    else:
        done = 0.0
        for x1, y1, x2, y2 in segs:
            seg = abs(x2 - x1) + abs(y2 - y1)
            rising = x1 == x2 and y2 < y1
            if x1 == x2 and rising == (glow == "rise"):
                t = start + draw * done / length
                c.wire(f"M{x1:.1f} {y1}V{y2}", seg, [(t, hold)], base=False)
            done += seg
    c.label(x0 - 10, (hi + lo) / 2 + 4, name, "end")
    return c.svg()


def comb(palette, kind):
    """The output follows its inputs at once, with no clock."""
    c = Canvas(96, 8.0, palette)
    if kind == "assign":  # assign sum = a + b;
        a_, b_, out = [(0, "1"), (2.0, "4")], [(0, "2"), (5.0, "5")], [(0, "3"), (2.12, "6"), (5.12, "9")]
        c.box(120, 18, 60, 56)
        c.label(150, 51, "+", "middle")
        c.wire("M36 32H120", 84, changes(a_))
        c.wire("M36 62H120", 84, changes(b_))
        c.wire("M180 46H264", 84, changes(out))
        c.label(28, 36, "a", "end")
        c.label(28, 66, "b", "end")
        c.label(272, 50, "sum")
        c.values(78, 24, a_)
        c.values(78, 54, b_)
        c.values(222, 38, out)
    else:  # always_comb: y = sel ? b : a
        c.h = 104
        a_, b_ = [(0, "3"), (1.5, "5"), (7.0, "9")], [(0, "7"), (5.5, "2")]
        sel, out = [(0, "0"), (3.5, "1")], [(0, "3"), (1.62, "5"), (3.62, "7"), (5.62, "2")]
        c.shape(f'<path d="M132 14L168 26V66L132 78Z" stroke="{{stroke}}" stroke-width="{{width}}"/>')
        c.wire("M36 30H132", 96, changes(a_))
        c.wire("M36 62H132", 96, changes(b_))
        c.wire("M150 96V72", 24, changes(sel))
        c.wire("M168 46H264", 96, changes(out))
        c.label(28, 34, "a", "end")
        c.label(28, 66, "b", "end")
        c.label(158, 94, "sel")
        c.label(272, 50, "y")
        c.values(84, 22, a_)
        c.values(84, 54, b_)
        c.values(158 + 3 * CHAR + 10, 94, sel, "start")
        c.values(216, 38, out)
    return c.svg()


def latch(palette):
    """always_latch: q follows d while en is 1 and holds when en drops."""
    c = Canvas(122, 8.0, palette)
    en = [(0, "1"), (4.0, "0")]
    d = [(0, "3"), (1.0, "5"), (2.5, "A"), (5.0, "7"), (6.5, "C")]
    q = [(0, "3"), (1.12, "5"), (2.62, "A")]
    c.box(120, 18, 60, 56)
    c.wire("M36 32H120", 84, changes(d))
    c.wire("M150 114V74", 40, changes(en))
    c.wire("M180 32H264", 84, changes(q))
    c.label(28, 36, "d", "end")
    c.label(272, 36, "q")
    c.label(158, 117, "en")
    c.values(158 + 2 * CHAR + 10, 117, en, "start")
    c.values(78, 24, d)
    c.values(222, 24, q)
    return c.svg()


def process(palette, kind):
    """always repeats, initial runs once at time 0, final runs once at the end."""
    if kind == "always":  # always #5 clk = ~clk;
        c = Canvas(70, 8.0, palette)
        ticks = [0.5 + i for i in range(8)]
        c.box(40, 18, 80, 36, events=flash(ticks, 0.2))
        c.wire("M120 36H250", 130, flash(ticks, 0.25, 0.06))
        c.label(258, 40, "clk")
        c.values(185, 28, [(0, "0")] + [(t + 0.06, "01"[(i + 1) % 2]) for i, t in enumerate(ticks)])
    elif kind == "initial":  # rst_n = 0; #20 rst_n = 1;
        c = Canvas(70, 8.0, palette)
        c.box(40, 18, 80, 36, events=[(0.2, 2.6)])
        c.wire("M120 36H250", 130, flash([0.2, 2.2], 0.3, 0.06))
        c.label(258, 40, "rst_n")
        c.values(185, 28, [(0, "x"), (0.26, "0"), (2.26, "1")])
    else:  # final $display("errors: %0d", error_count);
        c = Canvas(70, 8.0, palette)
        errors = [(0, "0"), (2.0, "1"), (4.5, "2")]
        c.box(110, 18, 70, 36, events=[(6.5, 7.2)])
        c.wire("M20 36H110", 90, changes(errors))
        c.wire("M180 36H220", 40, flash([6.5], 0.6, 0.15))
        c.label(20, 14, "error_count")
        c.label(228, 40, "$display")
        c.values(65, 30, errors)
    return c.svg()


def event(palette):
    """-> done wakes the process waiting on it."""
    c = Canvas(76, 6.0, palette)
    fire = 2.5
    c.box(16, 20, 70, 36, events=[(fire - 0.1, fire + 0.3)])
    c.box(214, 20, 70, 36, events=[(fire + 0.15, fire + 1.2)])
    c.wire("M86 38H214", 128, flash([fire], 0.3))
    c.label(150, 30, "done", "middle")
    return c.svg()


def wait_stmt(palette):
    """wait (rst_n === 1'b1) blocks until the condition is true, then the forks start."""
    c = Canvas(96, 6.0, palette)
    rst = [(0, "0"), (2.0, "1")]
    c.wire("M56 48H110", 54, changes(rst))
    c.box(110, 30, 50, 36, events=[(2.05, 2.5)])
    c.wire("M160 48H180V24H220", 84, [(2.3, 5.0, 1.6)])
    c.wire("M160 48H180V72H220", 84, [(2.3, 5.0, 2.4)])
    c.label(48, 52, "rst_n", "end")
    c.values(83, 40, rst)
    c.label(228, 28, "drive")
    c.label(228, 76, "monitor")
    return c.svg()


def wait_order(palette):
    """Case 1: the events arrive in order. Case 2: gnt_ev arrives before req_ev, so the else branch runs."""
    c = Canvas(104, 8.0, palette)
    c.wire("M80 24H150", 70, flash([0.8]))
    c.wire("M80 52H150", 70, flash([1.6, 4.8]))
    c.wire("M80 80H150", 70, flash([2.4]))
    c.box(150, 14, 50, 76, events=[(2.5, 3.0), (4.9, 5.4)])
    c.wire("M200 32H220", 20, flash([2.6], 0.5))
    c.wire("M200 72H220", 20, flash([5.0], 0.5))
    c.label(72, 28, "req_ev", "end")
    c.label(72, 56, "gnt_ev", "end")
    c.label(72, 84, "done_ev", "end")
    c.label(226, 36, "$display")
    c.label(226, 76, "$error")
    return c.svg()


def fork(palette, threads, mode):
    """Threads run in parallel; the parent resumes after all of them (join), the first (join_any),
    or at once (join_none). disable kills the threads still running."""
    n = len(threads)
    mid = 50 if n == 2 else 56
    rows = [26, 74] if n == 2 else [18, 40, 72, 94]
    c = Canvas(mid * 2 - 4 if n == 2 else 104, 6.5, palette)
    start, hold = 0.6, c.t - 0.7
    ends = [start + d for _, d in threads]
    if mode == "join":
        resume = max(ends)
    elif mode == "join_any":
        resume = min(ends)
    else:
        resume = start
    c.wire(f"M10 {mid}H50", 40, [(0.3, hold, 0.3)])
    for (name, dur), y in zip(threads, rows):
        back = mode != "join_none"
        d = f"M50 {mid}V{y}H230" + (f"V{mid}" if back else "")
        length = abs(y - mid) * (2 if back else 1) + 180
        if mode == "join_any" and start + dur > resume:  # disable fork kills it
            ev = (start, resume, resume - start, (resume - start) / dur)
        else:
            ev = (start, hold, dur)
        c.wire(d, length, [ev])
        c.label(60, y - 5, name)
    c.dot(50, mid)
    if mode == "join_none":
        c.wire(f"M50 {mid}H290", 240, [(resume + 0.05, hold)])
    else:
        c.dot(230, mid)
        c.wire(f"M230 {mid}H290", 60, [(resume, hold)])
    return c.svg()


GATES = {
    # body, output x, extra back curve, input end x for an input at fraction s of the height
    "and": ("M130 {t}H156A{r} {r} 0 0 1 156 {b}H130Z", lambda r: 156 + r, None, lambda s: 130),
    "or": ("M124 {t}Q144 {c} 124 {b}Q166 {b} 190 {c}Q166 {t} 124 {t}Z", lambda r: 190, None, lambda s: 124 + 40 * s * (1 - s)),
    "xor": ("M124 {t}Q144 {c} 124 {b}Q166 {b} 190 {c}Q166 {t} 124 {t}Z", lambda r: 190, "M116 {t}Q136 {c} 116 {b}",
            lambda s: 116 + 40 * s * (1 - s)),
    "buf": ("M130 {t}L176 {c}L130 {b}Z", lambda r: 176, None, lambda s: 130),
}


def gate(palette, kind, ins, outs, invert, rule, steps, step=1.0):
    """Inputs cycle through values; each wire flashes when its value changes."""
    n = len(ins)
    half = max(20, n * 8) if kind != "buf" else 18
    c_y = half + 14
    t, b = c_y - half, c_y + half
    canvas = Canvas(b + 16, len(steps) * step, palette)
    body, out_x, back, in_end = GATES[kind]
    out_x = out_x(half)
    fmt = dict(t=t, b=b, c=c_y, r=half)
    canvas.shape(f'<path d="{body.format(**fmt)}" stroke="{{stroke}}" stroke-width="{{width}}"/>')
    if back:
        canvas.shape(f'<path d="{back.format(**fmt)}" stroke="{{stroke}}" stroke-width="{{width}}"/>')
    if invert:
        canvas.add(f'<circle cx="{out_x + 4}" cy="{c_y}" r="4" stroke="{canvas.line}" stroke-width="{STROKE}"/>')
        out_x += 8
    times = [i * step for i in range(len(steps))]
    lx = 8 + max(len(x) for x in ins) * CHAR
    for i, name in enumerate(ins):
        y = c_y if n == 1 else t + 8 + i * (b - t - 16) / (n - 1)
        x_end = in_end((y - t) / (b - t))
        level = [(tt, str(s[i])) for tt, s in zip(times, steps)]
        canvas.wire(f"M{lx + 22:g} {y:g}H{x_end:.1f}", round(x_end - lx - 22, 1), changes(level))
        canvas.label(lx, y + 4, name, "end")
        canvas.values(lx + 12, y + 4, level)
    out = [(tt + (0.12 if tt else 0), str(int(rule([int(v) for v in s]) ^ invert))) for tt, s in zip(times, steps)]
    if len(outs) == 1:
        canvas.wire(f"M{out_x:g} {c_y}H250", 250 - out_x, changes(out))
        canvas.label(256, c_y + 4, outs[0])
        canvas.values(225, c_y - 6, out)
    else:
        for name, dy in zip(outs, (-12, 12)):
            canvas.wire(f"M{out_x:g} {c_y}H200V{c_y + dy}H250", 200 - out_x + 12 + 50, changes(out))
            canvas.label(256, c_y + dy + 4, name)
            canvas.values(228, c_y + dy - 5, out)
    return canvas.svg()


def tristate(palette, kind, data, en, pad):
    """The output follows data while enabled and floats to z when not."""
    c = Canvas(82, 8.0, palette)
    cy = 55
    low, inverted = kind.endswith("0"), kind.startswith("notif")
    data_v = "10110101"
    active = "11110000"
    times = [float(i) for i in range(8)]
    c.shape(f'<path d="M130 {cy - 18}L176 {cy}L130 {cy + 18}Z" stroke="{{stroke}}" stroke-width="{{width}}"/>')
    out_x = 176
    if inverted:
        c.add(f'<circle cx="{out_x + 4}" cy="{cy}" r="4" stroke="{c.line}" stroke-width="{STROKE}"/>')
        out_x += 8
    top = cy - 9
    if low:
        c.add(f'<circle cx="153" cy="{top - 4}" r="4" stroke="{c.line}" stroke-width="{STROKE}"/>')
        top -= 8
    on = [(t, a) for t, a in zip(times, active)]
    c.wire(f"M153 12V{top}", top - 12, changes(on))
    d_steps = [(t, v) for t, v in zip(times, data_v)]
    lx = 8 + len(data) * CHAR
    c.wire(f"M{lx + 22:g} {cy}H130", 130 - lx - 22, changes(d_steps))
    p_steps = [(t + (0.12 if t else 0), ("z" if a == "0" else str(int(v) ^ inverted))) for t, v, a in zip(times, data_v, active)]
    c.wire(f"M{out_x} {cy}H250", 250 - out_x, changes(p_steps))
    c.label(lx, cy + 4, data, "end")
    c.values(lx + 12, cy + 4, d_steps)
    c.label(161, 22, en)
    c.values(161 + len(en) * CHAR + 10, 22, [(t, str(int(a) ^ low)) for t, a in on], "start")
    c.label(256, cy + 4, pad)
    c.values(225, cy - 6, p_steps)
    return c.svg()


def branch(palette, items, select, out, steps, step=1.6):
    """A multiplexer: the select value lights the one branch that runs, or none."""
    n = len(items)
    top, gap = 18, 18
    ys = [top + i * gap for i in range(n)]
    y0, y1 = ys[0] - 10, ys[-1] + 10
    mid = (y0 + y1) / 2
    c = Canvas(y1 + 30, len(steps) * step, palette)
    c.shape(f'<path d="M150 {y0}L176 {y0 + 8}V{y1 - 8}L150 {y1}Z" stroke="{{stroke}}" stroke-width="{{width}}"/>')
    times = [i * step for i in range(len(steps))]
    picked = [(t, "" if k is None else str(k)) for t, (_, k, _) in zip(times, steps)]
    for i, (name, y) in enumerate(zip(items, ys)):
        # a branch flashes when it becomes the one that runs
        lit = [(t, t + 0.3) for (t, k), (_, prev) in zip(picked[1:], picked) if k == str(i) and k != prev]
        c.wire(f"M100 {y}H150", 50, lit)
        c.label(94, y + 4, name, "end")
    sel_y = y1 + 22
    sel_steps = [(t, v) for t, (v, _, _) in zip(times, steps)]
    c.wire(f"M163 {sel_y}V{y1 - 4}", sel_y - y1 + 4, changes(sel_steps))
    c.label(155, sel_y + 4, select, "end")
    c.values(171, sel_y + 4, sel_steps, "start")
    out_steps = [(t + (0.15 if t else 0), o) for t, (_, _, o) in zip(times, steps)]
    c.wire(f"M176 {mid:g}H236", 60, changes(out_steps))
    c.label(242, mid + 4, out)
    c.values(206, mid - 6, out_steps)
    return c.svg()


def assertion(palette, rows, n, cases):
    """The property checked cycle by cycle. Each case: ({row: high cycles}, decided at cycle, result)."""
    step = 0.45 if n <= 8 else 0.25
    per_case = n * step + 1.3
    c = Canvas(14 + len(rows) * 22 + 20, per_case * len(cases), palette)
    x0, gap = 80, (4 if n <= 8 else 2)
    w = (W - 6 - x0 - gap * (n - 1)) / n
    for r, name in enumerate(rows):
        y = 10 + r * 22
        c.label(72, y + 11, name, "end")
        for k in range(n):
            lit = []
            for i, (highs, _, _) in enumerate(cases):
                if k in highs.get(name, ()):
                    t0 = i * per_case + k * step
                    lit.append((t0 + 0.05, (i + 1) * per_case - 0.5))
            c.cell(x0 + k * (w + gap), y, w, 14, lit)
    y = 10 + len(rows) * 22 + 10
    for i, (_, at, result) in enumerate(cases):
        t0 = i * per_case + at * step + 0.2
        steps = [(0, "")] + [(t0, result), ((i + 1) * per_case - 0.3, "")]
        x = min(x0 + at * (w + gap) + w / 2, W - 2 - len(result) * CHAR / 2)
        c.values(x, y, steps)
    return c.svg()


# ===================================================================== UVM


PHASES = ["build", "connect", "end_of_elaboration", "start_of_simulation", "run", "extract", "check", "report", "final"]
RUNTIME = ["reset", "configure", "main", "shutdown"]


def phases(palette, focus=None, runtime=False):
    """The phases light in order; this page's phase holds its light."""
    gap = 14
    c = Canvas(10 + gap * (len(PHASES) + (3 if runtime else 0)) + 4, 7.0, palette)
    ys, y, t, times = {}, 10, 0.3, {}
    for name in PHASES:
        ys[name], times[name] = y, t
        if name == "run":
            y += gap * (4 if runtime else 1)
            t += 2.6
        else:
            y += gap
            t += 0.4
    for a, b in zip(PHASES, PHASES[1:]):
        dur = 2.6 if a == "run" else 0.4
        c.wire(f"M24 {ys[a] + 3.5}V{ys[b] - 3.5}", ys[b] - ys[a] - 7, [(times[a] + 0.05, times[a] + dur, dur - 0.05)])
    for name in PHASES:
        hold = c.t - 0.6 if name == focus else times[name] + 0.4
        c.shape(f'<circle cx="24" cy="{ys[name]}" r="3.5" stroke="{{stroke}}" stroke-width="{{width}}"/>',
                [(times[name], hold)])
        c.label(36, ys[name] + 4, name)
    if runtime:
        x, t0 = 150, times["run"]
        for i, name in enumerate(RUNTIME):
            yy, tt = ys["run"] + i * gap, t0 + 0.1 + i * 0.6
            hold = c.t - 0.6 if name == focus else tt + 0.6
            if i:
                c.wire(f"M{x} {yy - gap + 3.5}V{yy - 3.5}", gap - 7, [(tt - 0.15, tt + 0.1, 0.15)])
            c.shape(f'<circle cx="{x}" cy="{yy}" r="3.5" stroke="{{stroke}}" stroke-width="{{width}}"/>', [(tt, hold)])
            c.label(x + 12, yy + 4, name)
    return c.svg()


def objections(palette, ready_to_end=False):
    """The count rises and falls; the phase ends once it is 0 and the drain time has passed."""
    c = Canvas(96, 8.0, palette)
    raises, drops = [0.8, 1.8], [3.6, 5.0]
    count = [(0, "0"), (0.95, "1"), (1.95, "2"), (3.75, "1"), (5.15, "0")]
    end = 6.0
    if ready_to_end:
        raises.append(5.5)
        drops.append(6.2)
        count += [(5.65, "1"), (6.35, "0")]
        end = 6.8
    c.box(10, 22, 60, 52, "test")
    c.box(170, 22, 60, 52, events=[(end - 0.05, end + 0.4)])
    c.wire("M70 36H170", 100, flash(raises))
    c.wire("M70 60H170", 100, flash(drops))
    c.wire("M230 48H290", 60, [(end, c.t - 0.7)])
    c.label(120, 30, "raise", "middle")
    c.label(120, 78, "drop", "middle")
    c.label(200, 40, "phase", "middle")
    c.values(200, 62, count)
    return c.svg()


def handshake(palette, response=False):
    """Sequence, sequencer and driver: the request and grant, the item, then item_done back."""
    c = Canvas(100, 8.0, palette)
    req, drive, done = 2.0, (2.4, 4.4), 4.6
    c.box(10, 26, 60, 48, "seq", [(5.0, 5.5)] + ([(6.4, 6.9)] if response else []))
    c.box(120, 26, 60, 48, "sqr")
    c.box(230, 26, 60, 48, "drv", [drive])
    c.wire("M70 40H120", 50, flash([0.6, req]))
    c.wire("M180 40H230", 50, flash([req + 0.3]))
    c.wire("M230 60H180", 50, flash([done] + ([5.8] if response else [])))
    c.wire("M120 60H70", 50, flash([1.2, done + 0.3] + ([6.1] if response else [])))
    c.values(95, 34, [(0, ""), (req, "req"), (req + 0.7, "")])
    c.values(205, 34, [(0, ""), (req + 0.3, "req"), (drive[1], "")])
    c.values(205, 76, [(0, ""), (done, "done"), (done + 0.8, "")] + ([(5.8, "rsp"), (6.6, "")] if response else []))
    c.values(95, 76, [(0, ""), (1.2, "grant"), (1.8, ""), (done + 0.3, "done"), (done + 1.1, "")]
             + ([(6.1, "rsp"), (6.9, "")] if response else []))
    return c.svg()


def analysis(palette):
    """One write from the monitor reaches every connected subscriber at once."""
    c = Canvas(110, 8.0, palette)
    writes = [1.0, 3.5, 6.0]
    c.box(10, 37, 60, 36, "mon", flash(writes, 0.3))
    c.wire("M70 55H120", 50, flash(writes, 0.3))
    c.dot(120, 55)
    for name, y in (("sb", 20), ("cov", 55), ("log", 90)):
        c.wire(f"M120 55V{y}H200", abs(55 - y) + 80, flash(writes, 0.3, 0.12))
        c.box(200, y - 14, 60, 28, name, flash(writes, 0.35, 0.25))
    c.values(95, 49, [(0, "")] + [x for i, t in enumerate(writes) for x in ((t, f"tr{i + 1}"), (t + 0.9, ""))])
    return c.svg()


def tlm_fifo(palette, kind="fifo"):
    """Items queue up between producer and consumer; put blocks when full, get when empty."""
    depth, x0, cw = 4, 100, 25
    if kind == "channel":
        c = Canvas(120, 8.0, palette)
        rows = [(30, [0.6, 1.4], [3.0, 3.8], "req"), (90, [4.4, 5.2], [6.2, 7.0], "rsp")]
        c.box(10, 16, 50, 88, "prod", [])
        c.box(240, 16, 50, 88, "cons", [])
        for y, puts, gets, name in rows:
            forward = name == "req"
            a, b = ("M60", "H100") if forward else ("M240", "H200")
            c.wire(f"{a} {y}{b}", 40, flash(puts))
            c.wire(f"{'M200' if forward else 'M100'} {y}{'H240' if forward else 'H60'}", 40, flash(gets))
            count = sorted([(t + 0.15, 1) for t in puts] + [(t + 0.05, -1) for t in gets])
            level, n = [], 0
            for t, d in count:
                n += d
                level.append((t, n))
            for i in range(depth):
                k = i if forward else depth - 1 - i
                lit = [(t, level[j + 1][0] if j + 1 < len(level) else c.t) for j, (t, n) in enumerate(level) if n > k]
                c.cell(x0 + i * cw + 2, y - 10, cw - 4, 20, lit)
            c.label(150, y - 16, name, "middle")
        return c.svg()
    c = Canvas(90, 10.0, palette)
    if kind == "analysis":
        puts, gets, blocked_put, blocked_get = [0.6, 1.4, 2.2, 3.0, 3.8], [4.4, 5.2, 6.0, 6.8, 7.6], None, None
    else:
        puts, gets, blocked_put, blocked_get = [0.6, 1.4, 2.2, 3.0, 5.1], [5.0, 6.2, 7.0, 7.8, 8.6], (3.8, 5.0), (9.0, 9.2)
    c.box(10, 27, 50, 36, "prod", [])
    c.box(240, 27, 50, 36, "cons", [])
    put_ev = flash(puts) + ([blocked_put] if blocked_put else [])
    get_ev = flash(gets) + ([blocked_get] if blocked_get else [])
    c.wire("M60 45H100", 40, put_ev)
    c.wire("M200 45H240", 40, get_ev)
    events = sorted([(t + 0.15, 1) for t in puts] + [(t + 0.05, -1) for t in gets])
    level, n = [], 0
    for t, d in events:
        n += d
        level.append((t, n))
    for i in range(depth):
        k = depth - 1 - i  # items fill from the consumer's end
        lit = [(t, level[j + 1][0] if j + 1 < len(level) else c.t) for j, (t, n) in enumerate(level) if n > k]
        c.cell(x0 + i * cw + 2, 35, cw - 4, 20, lit)
    c.values(150, 80, [(0, "0")] + [(t, str(min(n, 9))) for t, n in level], "middle")
    return c.svg()


def agent(palette, passive_case=False):
    """Inside an agent: sequencer to driver to the interface, and interface to monitor to analysis port.
    passive_case: the second half shows a passive agent, with no sequencer or driver."""
    c = Canvas(150 if passive_case else 130, 10.0 if passive_case else 6.0, palette)
    flows = [0.6, 3.4] if not passive_case else [0.6, 2.8]
    passive = [5.0, 7.5] if passive_case else []
    c.add(f'<rect x="6" y="6" width="214" height="118" rx="4" stroke="{c.line}" stroke-width="{STROKE}" stroke-dasharray="4 4"/>')
    c.box(244, 40, 50, 50, "vif", flash(flows + passive, 0.4, 0.4))
    c.box(136, 80, 60, 32, "mon", flash(flows + passive, 0.4, 0.95))
    c.wire("M244 78H226V96H196", 54, flash(flows + passive, 0.3, 0.8))
    c.wire("M136 96H16", 120, flash(flows + passive, 0.3, 1.3))
    c.label(20, 90, "ap")
    start = len(c.parts)
    c.box(16, 16, 60, 32, "sqr")
    c.box(136, 16, 60, 32, "drv", flash(flows, 0.4, 0.15))
    c.wire("M76 32H136", 60, flash(flows, 0.3))
    c.wire("M196 32H226V52H244", 68, flash(flows, 0.3, 0.3))
    if passive_case:
        c.dim(start, [(4.6, 9.4)])
        c.label(6, 142, "is_active")
        c.values(6 + 10 * CHAR, 142, [(0, "UVM_ACTIVE"), (4.6, "UVM_PASSIVE"), (9.6, "UVM_ACTIVE")], "start")
    return c.svg()


# ===================================================================== pages


def a(fn, **kw):
    return partial(fn, **kw)


# <subfolder>/<tag>/<animation>: the page refers to it as <animation>.svg
ANIMATIONS = {
    # sequential and combinational processes
    "sv/always_ff/behavior": a(flop),
    "sv/posedge/behavior": a(waveform, name="clk", glow="rise"),
    "sv/negedge/behavior": a(waveform, name="rst_n", glow="fall", pulse_at=0.75),
    "sv/iff/behavior": a(flop, reset=False, enable="en"),
    "sv/edge/behavior": a(waveform, name="toggle", glow="all"),
    "sv/always_comb/behavior": a(comb, kind="always_comb"),
    "sv/assign/behavior": a(comb, kind="assign"),
    "sv/always_latch/behavior": a(latch),
    "sv/always/behavior": a(process, kind="always"),
    "sv/initial/behavior": a(process, kind="initial"),
    "sv/final/behavior": a(process, kind="final"),
    # events and waiting
    "sv/event/behavior": a(event),
    "sv/wait/behavior": a(wait_stmt),
    "sv/wait_order/behavior": a(wait_order),
    # parallel processes
    "sv/fork/behavior": a(fork, threads=[("drive_request", 2.0), ("wait_for_response", 3.5)], mode="join"),
    "sv/join/behavior": a(fork, threads=[("send_packet", 3.0), ("receive_packet", 2.0)], mode="join"),
    "sv/join_any/behavior": a(fork, threads=[("wait (done)", 1.8), ("#1us $error", 4.0)], mode="join_any"),
    "sv/disable/behavior": a(fork, threads=[("wait (done)", 1.8), ("#1000 $error", 4.0)], mode="join_any"),
    "sv/join_none/behavior": a(fork, threads=[(f"run_channel({k})", d) for k, d in enumerate([2.5, 3.5, 2.0, 4.0])],
                                mode="join_none"),
    # gates
    "sv/and/behavior": a(gate, kind="and", ins=["a", "b", "c"], outs=["y"], invert=False, rule=all,
                         steps=[(0, 0, 0), (1, 0, 0), (1, 1, 0), (1, 1, 1), (0, 1, 1), (1, 0, 1), (1, 1, 1), (0, 0, 1)]),
    "sv/nand/behavior": a(gate, kind="and", ins=["a", "b"], outs=["y"], invert=True, rule=all,
                          steps=[(0, 0), (0, 1), (1, 0), (1, 1)], step=1.5),
    "sv/or/behavior": a(gate, kind="or", ins=["a", "b"], outs=["y"], invert=False, rule=any,
                        steps=[(0, 0), (0, 1), (1, 0), (1, 1)], step=1.5),
    "sv/nor/behavior": a(gate, kind="or", ins=["a", "b"], outs=["y"], invert=True, rule=any,
                         steps=[(0, 0), (0, 1), (1, 0), (1, 1)], step=1.5),
    "sv/xor/behavior": a(gate, kind="xor", ins=["d0", "d1", "d2", "d3"], outs=["p"], invert=False,
                         rule=lambda v: sum(v) % 2,
                         steps=[(0, 0, 0, 0), (1, 0, 0, 0), (1, 1, 0, 0), (1, 1, 1, 0), (1, 1, 1, 1), (0, 1, 1, 1),
                                (0, 0, 1, 0), (0, 1, 0, 1)]),
    "sv/xnor/behavior": a(gate, kind="xor", ins=["a", "b"], outs=["eq"], invert=True, rule=lambda v: sum(v) % 2,
                          steps=[(0, 0), (0, 1), (1, 0), (1, 1)], step=1.5),
    "sv/not/behavior": a(gate, kind="buf", ins=["y"], outs=["y_n"], invert=True, rule=all,
                         steps=[(0,), (1,), (1,), (0,), (1,), (0,)]),
    "sv/buf/behavior": a(gate, kind="buf", ins=["clk_in"], outs=["clk_a", "clk_b"], invert=False, rule=all,
                         steps=[(0,), (1,), (0,), (1,), (1,), (0,)]),
    # tri-state gates
    "sv/bufif0/behavior": a(tristate, kind="bufif0", data="data", en="oe_n", pad="pad"),
    "sv/bufif1/behavior": a(tristate, kind="bufif1", data="data", en="oe", pad="pad"),
    "sv/notif0/behavior": a(tristate, kind="notif0", data="data", en="oe_n", pad="pad"),
    "sv/notif1/behavior": a(tristate, kind="notif1", data="data", en="oe", pad="pad"),
    # branching
    "sv/if/behavior": a(branch, items=["a", "b", "'0"], select="sel", out="y",
                        steps=[("0", 0, "a"), ("1", 1, "b"), ("2", 2, "0"), ("3", 2, "0")]),
    "sv/else/behavior": a(branch, items=["y = 1", "y = 2"], select="a,b", out="y",
                          steps=[("1,1", 0, "1"), ("1,0", 1, "2"), ("0,1", None, "2"), ("0,0", None, "2")]),
    "sv/case/behavior": a(branch, items=["IDLE", "BUSY", "default"], select="state", out="next",
                          steps=[("IDLE", 0, "BUSY"), ("BUSY", 1, "DONE"), ("DONE", 2, "IDLE")]),
    "sv/casex/behavior": a(branch, items=["1xxx_xxxx", "01xx_xxxx", "default"], select="instr", out="op",
                           steps=[("1010_0011", 0, "LOAD"), ("0110_1100", 1, "STORE"), ("0011_0000", 2, "NOP"),
                                  ("1x00_0000", 0, "LOAD")]),
    "sv/casez/behavior": a(branch, items=["1???", "01??", "001?", "0001", "default"], select="req", out="grant",
                           steps=[("1010", 0, "1000"), ("0110", 1, "0100"), ("0011", 2, "0010"), ("0001", 3, "0001"),
                                  ("0000", 4, "0000")]),
    "sv/unique/behavior": a(branch, items=["2'b00", "2'b01", "2'b10", "2'b11"], select="sel", out="y",
                            steps=[("00", 0, "a"), ("01", 1, "b"), ("10", 2, "c"), ("11", 3, "d")]),
    "sv/unique0/behavior": a(branch, items=["sel[0]", "sel[1]"], select="sel", out="y",
                             steps=[("01", 0, "a"), ("10", 1, "b"), ("00", None, "b")]),
    "sv/priority/behavior": a(branch, items=["req[0]", "req[1]", "else"], select="req", out="grant",
                              steps=[("001", 0, "001"), ("010", 1, "010"), ("011", 0, "001"), ("100", 2, "100")]),
    # concurrent assertions: cycles start at 0
    "sv/assert/behavior": a(assertion, rows=["req", "ack"], n=8,
                            cases=[({"req": {1}, "ack": {3}}, 3, "pass"), ({"req": {1}}, 4, "fail")]),
    "sv/property/behavior": a(assertion, rows=["req", "ack"], n=8,
                              cases=[({"req": {1}, "ack": {3}}, 3, "pass"), ({"req": {1}}, 4, "fail")]),
    "sv/sequence/behavior": a(assertion, rows=["start", "req", "ack"], n=8,
                              cases=[({"start": {1}, "req": {1}, "ack": {4}}, 4, "pass"),
                                     ({"start": {1}, "req": {1}}, 5, "fail")]),
    "sv/throughout/behavior": a(assertion, rows=["start", "busy", "done"], n=8,
                                cases=[({"start": {1}, "busy": {1, 2, 3, 4, 5}, "done": {5}}, 5, "pass"),
                                       ({"start": {1}, "busy": {1, 2}, "done": {6}}, 3, "fail")]),
    "sv/within/behavior": a(assertion, rows=["en", "wr"], n=8,
                            cases=[({"en": {1, 2, 3, 4, 5}, "wr": {2, 3}}, 5, "pass"),
                                   ({"en": {1, 2, 3, 4, 5}, "wr": {5, 6}}, 5, "fail")]),
    "sv/until/behavior": a(assertion, rows=["req", "gnt"], n=8,
                           cases=[({"req": {1, 2, 3}, "gnt": {4}}, 4, "pass"),
                                  ({"req": {1, 2}, "gnt": {5}}, 3, "fail")]),
    "sv/eventually/behavior": a(assertion, rows=["req", "gnt"], n=17,
                                cases=[({"req": {0}, "gnt": {9}}, 9, "pass"), ({"req": {0}}, 16, "fail")]),
    "sv/nexttime/behavior": a(assertion, rows=["load", "q==d_last"], n=8,
                              cases=[({"load": {1}, "q==d_last": {2}}, 2, "pass"), ({"load": {1}}, 2, "fail")]),
    # UVM phases
    "uvm/uvm_phase/behavior": a(phases),
    **{f"uvm/{p}_phase/behavior": a(phases, focus=p) for p in PHASES},
    **{f"uvm/{p}_phase/behavior": a(phases, focus=p, runtime=True) for p in RUNTIME},
    # objections
    **{f"uvm/{p}/behavior": a(objections) for p in ["uvm_objection", "raise_objection", "drop_objection", "phase_done",
                                                    "set_drain_time", "all_dropped"]},
    "uvm/phase_ready_to_end/behavior": a(objections, ready_to_end=True),
    # sequence to driver
    **{f"uvm/{p}/behavior": a(handshake) for p in ["start_item", "finish_item", "get_next_item", "item_done",
                                                   "try_next_item", "seq_item_port", "seq_item_export",
                                                   "uvm_seq_item_pull_port", "wait_for_grant", "body", "uvm_do",
                                                   "uvm_send", "uvm_rand_send", "uvm_create"]},
    **{f"uvm/{p}/behavior": a(handshake, response=True) for p in ["get_response", "rsp_port", "set_id_info"]},
    # analysis and TLM
    **{f"uvm/{p}/behavior": a(analysis) for p in ["uvm_analysis_port", "uvm_analysis_imp", "uvm_analysis_export",
                                                  "analysis_export", "uvm_subscriber", "uvm_analysis_imp_decl"]},
    "uvm/uvm_tlm_fifo/behavior": a(tlm_fifo),
    "uvm/uvm_blocking_put_port/behavior": a(tlm_fifo),
    "uvm/uvm_tlm_analysis_fifo/behavior": a(tlm_fifo, kind="analysis"),
    "uvm/uvm_tlm_req_rsp_channel/behavior": a(tlm_fifo, kind="channel"),
    # agents
    **{f"uvm/{p}/behavior": a(agent) for p in ["uvm_agent", "uvm_driver", "uvm_monitor", "uvm_sequencer", "uvm_sequence"]},
    **{f"uvm/{p}/behavior": a(agent, passive_case=True) for p in ["is_active", "get_is_active", "UVM_ACTIVE",
                                                                  "UVM_PASSIVE", "uvm_active_passive_enum"]},
}


def main():
    for target, draw in ANIMATIONS.items():
        for theme, palette in PALETTES.items():
            out = LIBRARY / f"{target}.{theme}.svg"
            out.write_text(draw(palette), encoding="utf-8", newline="\n")
    print(f"wrote {len(ANIMATIONS)} animations, {len(ANIMATIONS) * len(PALETTES)} files")


if __name__ == "__main__":
    main()
