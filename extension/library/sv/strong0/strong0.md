**`strong0`** — strong strength for a 0, the default

The default drive strength for a 0 on continuous assignments and gates. Weaker than `supply0`.

```systemverilog
assign (strong0, weak1) bus = sel ? 1'b0 : 1'b1;
```
