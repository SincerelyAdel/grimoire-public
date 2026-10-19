**`bufif0`** — tri-state buffer, enabled low

A gate-level primitive with terminals `(out, in, control)`. When the control is inactive the output is `z`. Found in netlists and pad models.

---

**Coding example**

```systemverilog
bufif0 u_drv (pad, data, oe_n);   // drives when oe_n == 0
```

---

**Visual**

<img src="behavior.svg" width="300">
