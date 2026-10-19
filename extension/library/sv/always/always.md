**`always`** — general-purpose process

The Verilog process that repeats forever. It does not state design intent, so in synthesizable SystemVerilog prefer `always_ff`, `always_comb` or `always_latch`. Still common in testbenches, for example clock generators.

---

**Coding example**

```systemverilog
always #5 clk = ~clk;
```

---

**Visual**

<img src="behavior.svg" width="300">
