**`task`** — subroutine that may consume time

May contain delays, event controls and waits. Has no return value and passes results back through `output` or `ref` arguments. Mostly used in testbenches. Ends with `endtask`.

```systemverilog
task automatic send(input logic [7:0] value);
  @(posedge clk);
  data  <= value;
  valid <= 1'b1;
endtask
```
