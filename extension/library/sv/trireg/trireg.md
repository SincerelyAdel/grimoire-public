**`trireg`** — net that holds its last value

Models charge storage: when all drivers go to `z`, the net keeps its last value, decaying to `x` after an optional charge decay time. Used in switch-level modelling.

```systemverilog
trireg (medium) #(0, 0, 50) bitline;
```
