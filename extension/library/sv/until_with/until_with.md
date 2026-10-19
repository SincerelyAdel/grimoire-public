**`until_with`** — weak until, including the final cycle

`p until_with q` requires `p` to hold up to and including the cycle where `q` holds; `q` may never come.

```systemverilog
assert property (@(posedge clk) start |-> busy until_with done);
```
