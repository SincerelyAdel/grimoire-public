**`with`** — attach a clause to a call or construct

Adds detail to the item before it: `randomize() with { ... }` adds inline constraints, array methods take `with (expr)` (`q.find with (item > 3)`), covergroup bins can be filtered with `with`, and `std::randomize(x) with { ... }` constrains free variables.

```systemverilog
assert (pkt.randomize() with { len inside {[1:16]}; });
int big[$] = data.find with (item > 100);
```
