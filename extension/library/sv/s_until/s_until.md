**`s_until`** — strong until

Like `until`, but `q` must eventually hold before the simulation or proof ends; otherwise the property fails.

```systemverilog
assert property (@(posedge clk) req |-> req s_until gnt);
```
