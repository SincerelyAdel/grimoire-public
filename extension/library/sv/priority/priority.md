**`priority`** — at least one branch must match, first wins

Placed before `case` or `if`. States that the branches are evaluated in order and that one of them always matches. Simulation reports a violation if none matches.

---

**Coding example**

```systemverilog
priority if (req[0]) grant = 3'b001;
else if (req[1])     grant = 3'b010;
else                 grant = 3'b100;
```

---

**Visual**

<img src="behavior.svg" width="300">
