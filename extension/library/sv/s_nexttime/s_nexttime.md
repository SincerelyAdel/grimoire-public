**`s_nexttime`** — property holds on the next clock (strong)

Like `nexttime`, but the next tick must exist.

```systemverilog
assert property (@(posedge clk) start |-> s_nexttime busy);
```
