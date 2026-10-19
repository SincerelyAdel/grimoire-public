**`cmos`** — CMOS transmission gate

A switch-level primitive for transistor modelling. Terminals are `(out, data, ncontrol, pcontrol)`; an `nmos` and a `pmos` in parallel.

```systemverilog
cmos u_tg (out, data, ngate, pgate);
```
