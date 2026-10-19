**`until`** — weak until

`p until q` requires `p` to hold on every cycle until `q` holds; `q` may never come (weak). `p` need not hold on the cycle where `q` arrives. See `s_until` for the strong form and `until_with` for the overlapping one.

---

**Coding example**

```systemverilog
assert property (@(posedge clk) req |-> req until gnt);
```

---

**Visual**

<img src="behavior.svg" width="300">
