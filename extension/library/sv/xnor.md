**`xnor`** — built-in XNOR gate

A gate-level primitive. The first terminal is the output and the rest are inputs, with any number of inputs. Found mostly in netlists; in RTL write the operator instead. An optional drive strength and delay can follow the keyword.

```systemverilog
xnor u_xnor (eq, a, b);   // eq = ~(a ^ b)
```
