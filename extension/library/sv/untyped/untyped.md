**`untyped`** — argument with no declared type

Marks a formal argument of a `let`, `sequence` or `property` as taking any type, the default when no type is given.

```systemverilog
sequence s_stable(untyped sig, int n);
  $stable(sig) [*n];
endsequence
```
