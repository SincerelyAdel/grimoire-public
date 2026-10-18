**`module`** — design unit

The basic building block of a design. It declares parameters and ports, and contains declarations, processes, continuous assignments and instances of other modules. Ends with `endmodule`.

```systemverilog
module adder #(
  parameter int W = 8
) (
  input  logic [W-1:0] a, b,
  output logic [W:0]   sum
);
  assign sum = a + b;
endmodule
```
