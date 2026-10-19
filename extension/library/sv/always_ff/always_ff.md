**`always_ff`** — sequential logic process

Models flip-flops. Needs an edge-sensitive event control, and tools report an error if the block does not infer registers. Use non-blocking assignments (`<=`). A variable written here cannot be written by any other process.

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
