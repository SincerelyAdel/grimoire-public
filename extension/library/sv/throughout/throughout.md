**`throughout`** — condition that holds during a whole sequence

`cond throughout seq` matches the sequence only if the condition is true on every cycle from its start to its end.

---

**Coding example**

```systemverilog
assert property (@(posedge clk)
  start |-> (busy throughout (##[1:8] done)));
```

---

**Visual**

<img src="behavior.svg" width="300">
