**`accept_on`** — pass a property early on a condition

`accept_on (cond) p` makes the property pass as soon as the condition is true while it is being evaluated. The condition is checked asynchronously; `sync_accept_on` checks it only on clock ticks.

```systemverilog
assert property (@(posedge clk)
  accept_on (abort) start |-> ##[1:10] done);
```
