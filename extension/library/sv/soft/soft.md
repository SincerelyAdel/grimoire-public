**`soft`** — constraint that may be overridden

A `soft` constraint holds unless it conflicts with another constraint, such as an inline `with { ... }` from a test. Good for defaults that tests can change without disabling the whole block.

```systemverilog
class packet;
  rand int len;
  constraint c_default { soft len == 64; }
endclass

assert (p.randomize() with { len == 9; });   // overrides the soft default
```
