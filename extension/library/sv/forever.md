**`forever`** — loop with no end

Repeats the statement until the simulation stops or the enclosing block is disabled. The body must wait on time or an event, or the simulator hangs. Used for clock generators and monitor loops.

```systemverilog
initial begin
  clk = 0;
  forever #5 clk = ~clk;
end
```
