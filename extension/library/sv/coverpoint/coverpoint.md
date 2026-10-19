**`coverpoint`** — variable or expression to cover

Inside a `covergroup`, records which values an expression takes. Without explicit `bins`, the tool creates automatic bins (up to `auto_bin_max`). Add `iff (cond)` to sample only when the condition holds.

```systemverilog
covergroup cg;
  coverpoint opcode {
    bins alu[]  = {[0:7]};
    bins mem    = {8, 9};
    illegal_bins bad = {15};
  }
endgroup
```
