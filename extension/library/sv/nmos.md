**`nmos`** — NMOS transistor switch

A switch-level primitive for transistor modelling. Terminals are `(out, data, control)`; conducts when the control is 1.

```systemverilog
nmos u_n (out, data, gate);
```
