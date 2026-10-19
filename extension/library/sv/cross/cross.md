**`cross`** — coverage of combinations

Counts combinations of the bins of two or more coverpoints. Filter out impossible combinations with `binsof` and `ignore_bins`.

```systemverilog
covergroup cg @(posedge clk);
  cp_a : coverpoint a { bins lo = {[0:3]}; bins hi = {[4:7]}; }
  cp_b : coverpoint b;
  axb  : cross cp_a, cp_b;
endgroup
```
