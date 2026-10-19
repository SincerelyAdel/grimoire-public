**`highz0`** — drive nothing for a 0

In a strength specification, makes the driver output `z` instead of 0, modelling an open-drain style driver that only drives 1.

```systemverilog
assign (highz0, strong1) wired_or = req;
```
