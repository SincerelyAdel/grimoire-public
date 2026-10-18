**`wand`** — wired-AND net

Multiple drivers are combined with AND: any driver at 0 makes the net 0.

```systemverilog
wand ok;
assign ok = check_a;
assign ok = check_b;   // ok is check_a & check_b
```
