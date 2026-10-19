**`pull0`** — pull strength for a 0

Drive strength between `weak0` and `strong0`, as produced by a pull-down. Used in strength specifications such as `(pull0, strong1)`.

```systemverilog
assign (pull0, strong1) open_drain = drv ? 1'b0 : 1'b1;
```
