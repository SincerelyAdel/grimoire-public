**`expect`** — wait for a property in procedural code

Blocks the calling process until the property succeeds or fails, then runs the pass or `else` action. Starts evaluating at the next clock tick. Testbench only.

```systemverilog
initial begin
  start_transfer();
  expect (@(posedge clk) ##[1:10] done)
    $display("done in time");
  else
    $error("no done within 10 cycles");
end
```
