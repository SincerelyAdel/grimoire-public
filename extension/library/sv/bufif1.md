**`bufif1`** — tri-state buffer, enabled high

A gate-level primitive with terminals `(out, in, control)`. When the control is inactive the output is `z`. Found in netlists and pad models.

```systemverilog
bufif1 u_drv (pad, data, oe);   // drives when oe == 1
```
