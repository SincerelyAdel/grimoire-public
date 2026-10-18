**`macromodule`** — old synonym for module

Behaves exactly like `module`; kept for Verilog compatibility. Ends with `endmodule`.

```systemverilog
macromodule legacy_cell (input a, output y);
  assign y = ~a;
endmodule
```
