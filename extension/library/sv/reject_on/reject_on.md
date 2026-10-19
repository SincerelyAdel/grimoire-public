**`reject_on`** — fail a property early on a condition

`reject_on (cond) p` makes the property fail as soon as the condition is true while it is being evaluated. Checked asynchronously; `sync_reject_on` checks only on clock ticks.

```systemverilog
assert property (@(posedge clk)
  reject_on (error) start |-> ##[1:10] done);
```
