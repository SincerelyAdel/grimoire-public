**`strong`** — strong sequence or drive strength

In assertions, `strong(seq)` requires the sequence to complete, so the property fails if the trace ends first. In declarations, `strong0` and `strong1` are drive strengths, and `strong` is the default for sequences in `cover`.

```systemverilog
assert property (@(posedge clk) req |-> strong(##[1:$] gnt));
```
