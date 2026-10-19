**`within`** — sequence that occurs inside another

`s1 within s2` matches when `s1` happens entirely between the start and end of `s2`.

---

**Coding example**

```systemverilog
assert property (@(posedge clk)
  (wr ##1 wr) within (en [*5]));
```

---

**Visual**

<img src="behavior.svg" width="300">
