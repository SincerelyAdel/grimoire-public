**`int`** — 32-bit signed 2-state integer

A 2-state signed integer, 32 bits wide. Common for loop counters, parameters and testbench variables. The 4-state equivalent is `integer`.

```systemverilog
for (int i = 0; i < 8; i++)
  sum += data[i];
```
