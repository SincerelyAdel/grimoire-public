**`illegal_bins`** — values that must never occur

Values that report an error if sampled, and are left out of the coverage percentage.

```systemverilog
coverpoint opcode {
  illegal_bins undefined = {[200:255]};
}
```
