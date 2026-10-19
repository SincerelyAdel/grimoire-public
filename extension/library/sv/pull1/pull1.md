**`pull1`** — pull strength for a 1

Drive strength between `weak1` and `strong1`, as produced by a pull-up.

```systemverilog
assign (strong0, pull1) line = en ? 1'b0 : 1'b1;
```
