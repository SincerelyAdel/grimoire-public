**`if`** — conditional statement

Runs the statement when the condition is true (nonzero and not `x`/`z`), otherwise the optional `else` branch. An `x` condition takes the `else` branch. Chains of `else if` are priority-encoded; add `unique` or `priority` to state that the conditions are mutually exclusive or that one must match. In combinational logic, a missing `else` infers a latch.

```systemverilog
always_comb begin
  if (sel == 2'd0)      y = a;
  else if (sel == 2'd1) y = b;
  else                  y = '0;
end
```
