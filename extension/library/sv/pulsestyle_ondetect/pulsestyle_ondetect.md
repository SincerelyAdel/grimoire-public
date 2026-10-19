**`pulsestyle_ondetect`** — glitch x appears when the pulse is detected

In a `specify` block, a rejected pulse produces `x` as soon as the pulse is detected, which shows glitches earlier.

```systemverilog
specify
  pulsestyle_ondetect y;
endspecify
```
