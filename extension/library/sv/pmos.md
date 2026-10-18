**`pmos`** — PMOS transistor switch

A switch-level primitive for transistor modelling. Terminals are `(out, data, control)`; conducts when the control is 0.

```systemverilog
pmos u_p (out, data, gate);
```
