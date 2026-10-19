**`let`** — named expression with arguments

Defines a reusable expression, like a function without side effects or a safer macro. It is expanded where used and can take typed or untyped arguments. Common in assertions.

```systemverilog
let max(a, b) = (a > b) ? a : b;
let in_range(x, lo, hi) = (x >= lo) && (x <= hi);
assign biggest = max(x, y);
```
