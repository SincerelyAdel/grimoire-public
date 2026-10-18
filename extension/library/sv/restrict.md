**`restrict`** — constraint for formal tools only

`restrict property` limits what formal tools explore, like `assume`, but simulators ignore it. Useful to focus a proof, for example on a single operating mode.

```systemverilog
restrict property (@(posedge clk) mode == MODE_NORMAL);
```
