**`always_latch`** — latch process

Models level-sensitive latches. The sensitivity list is inferred, as with `always_comb`, but here an incomplete assignment is the intent, and tools report an error if no latch is inferred.

---

**Coding example**

```systemverilog
always_latch
  if (en) q <= d;
```

---

**Visual**

<img src="behavior.svg" width="300">
