**`assert`** — check that a condition holds

An immediate assertion is a statement that checks an expression when it executes. A concurrent assertion, written `assert property`, checks a temporal property on every clock. An optional `else` clause runs on failure.

---

**Coding example**

```systemverilog
assert (count <= DEPTH) else $error("overflow");

assert property (@(posedge clk) req |-> ##[1:3] ack);
```

---

**Visual**

<img src="behavior.svg" width="300">
