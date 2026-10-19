**`signed`** — treat a value as two's complement

Declares a vector or integer as signed, so comparisons, shifts and extension respect the sign. `$signed(x)` reinterprets an expression. If any operand in an expression is unsigned, the whole expression is evaluated unsigned, a common source of bugs.

```systemverilog
logic signed [7:0] a = -8'sd3;
logic        [7:0] b = 8'd5;
// a < b is false here: b is unsigned, so a is compared as 253
if ($signed(a) < $signed(b)) $display("ok");
```
