**`highz1`** — drive nothing for a 1

In a strength specification, makes the driver output `z` instead of 1, modelling an open-drain driver that only pulls low.

```systemverilog
assign (strong0, highz1) open_drain = ~req;
```
