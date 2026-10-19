**`always_comb`** — combinational logic process

Models combinational logic. The sensitivity list is inferred from everything the block reads, and the block also runs once at time zero. Use blocking assignments (`=`). Tools warn if a path leaves a variable unassigned, since that infers a latch.

---

**Coding example**

```systemverilog
always_comb begin
  y = a;
  if (sel) y = b;
end
```

---

**Visual**

<img src="behavior.svg" width="300">
