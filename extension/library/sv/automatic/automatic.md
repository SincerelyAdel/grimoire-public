**`automatic`** — per-call storage

Gives each call of a function or task, or each entry to a block, its own copy of the local variables. This makes recursion and concurrent calls safe. Subroutines in modules and packages are `static` by default; class methods are always automatic.

```systemverilog
function automatic int factorial(int n);
  return (n <= 1) ? 1 : n * factorial(n - 1);
endfunction
```
