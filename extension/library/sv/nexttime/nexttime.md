**`nexttime`** — property holds on the next clock (weak)

`nexttime p` requires `p` at the next clock tick; `nexttime [n] p` at the n-th. Weak: passes if there is no next tick.

---

**Coding example**

```systemverilog
assert property (@(posedge clk) load |-> nexttime (q == d_last));
```

---

**Visual**

<img src="behavior.svg" width="300">
