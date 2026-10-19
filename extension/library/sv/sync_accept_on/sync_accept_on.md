**`sync_accept_on`** — pass a property early, checked on the clock

Like `accept_on`, but the abort condition is sampled only at clock ticks.

```systemverilog
assert property (@(posedge clk) sync_accept_on (abort) req |-> ##[1:8] ack);
```
