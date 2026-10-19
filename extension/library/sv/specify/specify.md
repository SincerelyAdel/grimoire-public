**`specify`** — timing block

A `specify` block gives pin-to-pin delays and timing checks such as `$setup` and `$hold`, mainly in cell library models. Ends with `endspecify`.

```systemverilog
specify
  (a, b *> y) = (1.0, 1.2);
  $setup(d, posedge clk, 0.3);
  $hold(posedge clk, d, 0.1);
endspecify
```
