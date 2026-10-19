**`else`** — alternative branch of an if

Runs when the `if` condition is false or unknown. An `else` binds to the nearest unmatched `if`, so wrap nested `if`s in `begin`/`end` when that is not what you mean. In an `always_comb` block, give every `if` an `else` (or a default assignment first) to avoid latches.

---

**Coding example**

```systemverilog
if (a)
  if (b) y = 1;
  else   y = 2;
// the else above belongs to `if (b)`, not `if (a)`
```

---

**Visual**

<img src="behavior.svg" width="300">
