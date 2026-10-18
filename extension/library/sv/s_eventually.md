**`s_eventually`** — property must eventually hold (strong)

`s_eventually p` requires `p` to hold at some future cycle; fails if the trace ends first. A liveness property, mainly for formal tools.

```systemverilog
assert property (@(posedge clk) req |-> s_eventually gnt);
```
