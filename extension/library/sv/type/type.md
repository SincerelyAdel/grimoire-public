**`type`** — type operator and type parameter

`type(expr)` gives the type of an expression, for declaring matching variables or comparing types. `parameter type T = int` makes a type a module or class parameter.

```systemverilog
module fifo #(parameter type T = logic [7:0]) (input T din, output T dout);
  var type(din) last;
endmodule
```
