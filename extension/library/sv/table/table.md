**`table`** — truth table of a user-defined primitive

Lists input combinations and outputs for a `primitive`, with `?` for any value and, in sequential UDPs, the current state and edge entries such as `(01)`. Ends with `endtable`.

```systemverilog
table
// clk d : q : q+
   (01) 0 : ? : 0;
   (01) 1 : ? : 1;
   (0?) ? : ? : -;
endtable
```
