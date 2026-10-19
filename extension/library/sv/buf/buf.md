**`buf`** — built-in buffer

A gate-level primitive: `buf (out1, ..., in)` drives the last terminal's value to every output. Used in netlists for fan-out and delay.

---

**Coding example**

```systemverilog
buf #2 u_buf (clk_a, clk_b, clk_in);
```

---

**Visual**

<img src="behavior.svg" width="300">
