**`global`** — global clocking declaration

`global clocking ... endclocking` names the primary clock of the design, used by `$global_clock` and by sampled-value functions such as `$future_gclk` in formal verification.

```systemverilog
global clocking @(posedge sys_clk); endclocking
```
