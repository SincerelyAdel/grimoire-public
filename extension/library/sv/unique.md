**`unique`** — exactly one branch must match

Placed before `case` or `if`. States that the branches do not overlap and that one of them always matches. Simulation reports a violation if none matches or more than one does, and synthesis may treat the branches as parallel.

```systemverilog
unique case (sel)
  2'b00: y = a;
  2'b01: y = b;
  2'b10: y = c;
  2'b11: y = d;
endcase
```
