**`timeunit`** — time unit for a module, package or interface

Sets the unit for delays in the enclosing design element, such as `#5`, overriding `` `timescale``. Optionally with a precision: `timeunit 1ns / 1ps;`. Must come first in the element.

```systemverilog
module tb;
  timeunit 1ns;
  timeprecision 1ps;
  initial #2.5 $display("%t", $realtime);
endmodule
```
