**`noshowcancelled`** — hide cancelled pulses

In a `specify` block, cancelled pulses are dropped without producing `x`, the default behaviour.

```systemverilog
specify
  noshowcancelled y;
endspecify
```
