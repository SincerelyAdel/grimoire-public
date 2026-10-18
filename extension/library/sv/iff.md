**`iff`** — qualify an event or coverpoint

`@(posedge clk iff en)` triggers only when the condition is true at the edge. In a covergroup, `coverpoint x iff (valid)` samples only while the condition is true. In assertions, `disable iff` sets the reset condition.

```systemverilog
always @(posedge clk iff en) q <= d;

covergroup cg @(posedge clk);
  coverpoint opcode iff (valid);
endgroup
```
