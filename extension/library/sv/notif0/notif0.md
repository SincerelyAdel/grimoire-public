**`notif0`** — tri-state inverter, enabled low

A gate-level primitive with terminals `(out, in, control)`. When the control is inactive the output is `z`. Found in netlists and pad models.

---

**Coding example**

```systemverilog
notif0 u_drv (pad, data, oe_n);   // drives ~data when oe_n == 0
```

---

**Visual**

<img src="behavior.svg" width="300">
