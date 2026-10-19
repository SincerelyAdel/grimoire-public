**`s_always`** — property holds on every cycle of a range (strong)

`s_always [m:n] p` requires `p` on every cycle in the range, and the range must be reached. The weak form is plain `always [m:n] p`.

```systemverilog
assert property (@(posedge clk) start |-> s_always [1:4] busy);
```
