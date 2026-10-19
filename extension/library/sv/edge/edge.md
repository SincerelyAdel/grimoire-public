**`edge`** — either rising or falling edge

`@(edge sig)` triggers on any transition, the same as `posedge` or `negedge` together. Also used in `specify` timing checks.

---

**Coding example**

```systemverilog
always @(edge toggle) count++;
```

---

**Visual**

<img src="behavior.svg" width="300">
