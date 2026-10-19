**`before`** — used in solve ... before

Part of `solve a before b;` in a constraint, which makes the solver choose `a` before `b`.

```systemverilog
constraint c_order { solve mode before size; }
```
