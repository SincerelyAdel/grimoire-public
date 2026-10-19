**`ifnone`** — default delay in a specify block

Gives a path delay that applies when none of the conditional (`if`) path delays for that path are active.

```systemverilog
specify
  if (sel)  (a => y) = 1.0;
  ifnone    (a => y) = 1.5;
endspecify
```
