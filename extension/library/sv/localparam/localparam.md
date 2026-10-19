**`localparam`** — elaboration-time constant that cannot be overridden

Like `parameter`, but it cannot be overridden from outside. Used for values derived from other parameters.

```systemverilog
localparam int ADDR_W = $clog2(DEPTH);
```
