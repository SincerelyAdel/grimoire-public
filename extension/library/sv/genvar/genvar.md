**`genvar`** — generate loop variable

An integer that exists only during elaboration and is used as the index of a generate `for` loop. It cannot be read or written at simulation time.

```systemverilog
genvar i;
for (i = 0; i < 4; i++) begin : g_bit
  assign y[i] = a[i] ^ b[i];
end
```
