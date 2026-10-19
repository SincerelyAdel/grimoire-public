**`repeat`** — loop a fixed number of times

Runs the statement the given number of times; the count is evaluated once at the start. Common in testbenches with an event control, such as waiting a number of clock edges.

```systemverilog
repeat (5) @(posedge clk);   // wait five rising edges
repeat (N) begin
  send_random_packet();
end
```
