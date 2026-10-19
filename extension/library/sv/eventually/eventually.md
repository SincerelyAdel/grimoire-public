**`eventually`** — property must hold at some point (bounded)

`eventually [m:n] p` requires `p` to hold at some cycle in the range. Without a range, use `s_eventually`, the strong form, since an unbounded weak `eventually` is not allowed.

---

**Coding example**

```systemverilog
assert property (@(posedge clk) req |-> eventually [1:16] gnt);
```

---

**Visual**

<img src="behavior.svg" width="300">
