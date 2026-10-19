**`sync_reject_on`** — fail a property early, checked on the clock

Like `reject_on`, but the abort condition is sampled only at clock ticks.

```systemverilog
assert property (@(posedge clk) sync_reject_on (error) req |-> ##[1:8] ack);
```
