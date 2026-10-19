**`not`** — built-in inverter, or property negation

As a gate-level primitive, `not (out1, ..., in)` drives the inverse of the last terminal to every output. In assertions, `not p` holds when the property fails.

```systemverilog
not u_inv (y_n, y);
assert property (@(posedge clk) not (wr && rd));
```
