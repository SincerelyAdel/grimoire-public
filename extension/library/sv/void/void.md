**`void`** — no value

A `void` function returns nothing and is called as a statement. Cast a function's result to `void'(...)` to discard it on purpose. In a tagged union, a `void` member carries no data.

```systemverilog
function void log(string s);
  $display("[%0t] %s", $time, s);
endfunction

void'(pkt.randomize());
```
