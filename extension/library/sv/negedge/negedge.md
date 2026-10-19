**`negedge`** — falling edge event

Matches a transition towards 0: from `1` to `0`, `X` or `Z`, or from `X` or `Z` to `0`. Used in event controls, commonly for active-low asynchronous resets.

---

**Coding example**

```systemverilog
always_ff @(posedge clk or negedge rst_n)
  if (!rst_n) q <= '0;
  else        q <= d;
```

---

**Visual**

<img src="behavior.svg" width="300">
