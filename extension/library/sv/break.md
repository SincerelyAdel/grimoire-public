**`break`** — leave the innermost loop

Exits the nearest enclosing `for`, `foreach`, `while`, `do`, `repeat` or `forever` loop immediately. It does not leave a `fork` or a `case`. Synthesizable when the loop bounds are still constant.

```systemverilog
foreach (mem[i])
  if (mem[i] == key) begin
    found = i;
    break;
  end
```
