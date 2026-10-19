**`notif1`** — tri-state inverter, enabled high

A gate-level primitive with terminals `(out, in, control)`. When the control is inactive the output is `z`. Found in netlists and pad models.

---

**Coding example**

```systemverilog
notif1 u_drv (pad, data, oe);   // drives ~data when oe == 1
```

---

**Visual**

<img src="behavior.svg" width="300">
