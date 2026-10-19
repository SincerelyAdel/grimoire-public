**`notif1`** — tri-state inverter, enabled high

A gate-level primitive with terminals `(out, in, control)`. When the control is inactive the output is `z`. Found in netlists and pad models.

```systemverilog
notif1 u_drv (pad, data, oe);   // drives ~data when oe == 1
```
