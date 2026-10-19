**`generate`** — generate region

Marks a region of elaboration-time constructs: `for` loops that replicate hardware, and `if` or `case` that include it conditionally. The `generate` and `endgenerate` keywords are optional. Name each block so its instances have stable hierarchical paths.

```systemverilog
for (genvar i = 0; i < N; i++) begin : g_stage
  stage u_stage (.clk(clk), .d(d[i]), .q(q[i]));
end
```
