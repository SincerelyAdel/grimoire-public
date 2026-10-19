**`constraint`** — rules for randomization

A named block of expressions that `randomize()` must satisfy. Constraints can be turned off with `constraint_mode(0)`, overridden by a derived class with the same name, or added inline with `randomize() with { ... }`.

```systemverilog
class packet;
  rand int len;
  rand bit is_short;
  constraint c_len {
    len inside {[1:1500]};
    is_short -> len < 64;
  }
endclass
```
