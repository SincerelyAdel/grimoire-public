**`matches`** — pattern match against a tagged union

Used in `case ... matches`, `if ... matches` and conditional expressions to match a value against a pattern, binding parts of it to new variables. Mainly for tagged unions. Rarely supported by synthesis tools.

```systemverilog
typedef union tagged { int Int; void Invalid; } maybe_t;
maybe_t m;
case (m) matches
  tagged Int .n: $display("value %0d", n);
  tagged Invalid: $display("none");
endcase
```
