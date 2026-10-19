**`input`** — port that brings a value in

Declares an input port of a module, interface or program, or an input argument of a task or function. An input port is a net by default; write `input var` to make it a variable. In a `clocking` block, `input` signals are sampled with the input skew.

```systemverilog
module adder (input  logic [7:0] a, b,
              output logic [8:0] sum);
  assign sum = a + b;
endmodule
```
