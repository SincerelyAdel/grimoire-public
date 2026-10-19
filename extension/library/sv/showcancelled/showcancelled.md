**`showcancelled`** — show cancelled pulses as x

In a `specify` block, makes the output go to `x` when a scheduled transition is cancelled by a narrow pulse, so glitches are visible.

```systemverilog
specify
  showcancelled y;
  (a => y) = (2, 3);
endspecify
```
