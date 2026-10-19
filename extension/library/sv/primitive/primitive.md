**`primitive`** — user-defined primitive (UDP)

Defines a small gate with a truth `table`, either combinational or sequential. Found in cell libraries; write ordinary modules in new code. Ends with `endprimitive`.

```systemverilog
primitive mux2 (output y, input s, a, b);
  table
  // s a b : y
     0 0 ? : 0;
     0 1 ? : 1;
     1 ? 0 : 0;
     1 ? 1 : 1;
  endtable
endprimitive
```
