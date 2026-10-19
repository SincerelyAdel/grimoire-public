**`posedge`** — rising edge event

Matches a transition towards 1: from `0` to `1`, `X` or `Z`, or from `X` or `Z` to `1`. Used in event controls.

---

**Coding example**

```systemverilog
always_ff @(posedge clk) q <= d;
```

---

**Visual**

<img src="behavior.svg" width="300">
