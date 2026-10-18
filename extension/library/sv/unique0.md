**`unique0`** — case or if where at most one branch matches

Like `unique`, it checks that branches are mutually exclusive, but it does not complain when none matches. Synthesis may treat the items as parallel.

```systemverilog
unique0 case (1'b1)
  sel[0]: y = a;
  sel[1]: y = b;
endcase   // no warning if sel is 0
```
