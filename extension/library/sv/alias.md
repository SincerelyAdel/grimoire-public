**`alias`** — make two nets the same net

Connects nets so they become one, in both directions, without a driver. Useful for renaming or joining bits of a bus in netlists.

```systemverilog
wire [7:0] a;
wire [3:0] lo, hi;
alias a = {hi, lo};
```
