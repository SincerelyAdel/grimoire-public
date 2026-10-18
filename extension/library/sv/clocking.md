**`clocking`** — clocking block or default clock

A `clocking` block groups signals synchronized to one clock and gives them input and output skews, so testbench sampling and driving avoid races with the design. `default clocking` sets the clock for assertions and `##n` delays in its scope; `global clocking` names the design's fastest clock for formal tools.

```systemverilog
interface bus_if (input logic clk);
  logic req, gnt;
  clocking cb @(posedge clk);
    default input #1step output #1;
    output req;
    input  gnt;
  endclocking
endinterface
```
