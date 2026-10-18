**`s_until_with`** — strong until, including the final cycle

Like `until_with`, but `q` must eventually hold.

```systemverilog
assert property (@(posedge clk) start |-> busy s_until_with done);
```
