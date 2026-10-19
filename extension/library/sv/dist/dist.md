**`dist`** — weighted distribution in a constraint

Gives values or ranges relative weights. `:=` gives each value in a range the weight; `:/` splits the weight across the range. A `dist` is a soft preference for weighting, but its values are still hard limits.

```systemverilog
constraint c_kind {
  kind dist { READ := 6, WRITE := 3, IDLE := 1 };
  len  dist { [1:8] :/ 50, [9:64] :/ 50 };
}
```
