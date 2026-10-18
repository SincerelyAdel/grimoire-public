**`deassign`** — end a procedural continuous assign

Ends a procedural `assign` to a variable; the variable keeps its value until it is next assigned. Procedural `assign`/`deassign` is considered obsolete; use `force`/`release` in testbenches instead.

```systemverilog
assign q = 1'b0;   // procedural: inside an initial or always block
#10 deassign q;
```
