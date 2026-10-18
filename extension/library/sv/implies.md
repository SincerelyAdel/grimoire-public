**`implies`** — property implication

`p1 implies p2` holds if `p1` fails, or if `p1` and `p2` both hold, starting at the same cycle. Unlike `|->`, both sides are properties, not a sequence and a property.

```systemverilog
property p;
  @(posedge clk) (mode == SAFE) implies always (!wr_en);
endproperty
```
