**`solve`** — order of solving in constraints

`solve a before b;` makes the solver pick `a` first, which changes the distribution of `b` but not which solutions are legal. Use it when one variable's spread matters, such as choosing a mode evenly before its dependent fields.

```systemverilog
rand bit       is_long;
rand bit [7:0] len;
constraint c {
  is_long -> len > 200;
  solve is_long before len;   // is_long is now 50/50
}
```
