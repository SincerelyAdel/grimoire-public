**`for`** — counted loop

`for (init; condition; step) statement` repeats while the condition is true. The loop variable can be declared in the header (`for (int i = 0; ...)`), which makes it local to the loop. In synthesizable code the bounds must be constant so the loop can be unrolled; in a `generate` region use a `genvar` instead.

```systemverilog
always_comb begin
  parity = 1'b0;
  for (int i = 0; i < WIDTH; i++)
    parity ^= data[i];
end
```
