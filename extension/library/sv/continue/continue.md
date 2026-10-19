**`continue`** — skip to the next loop iteration

Ends the current pass of the innermost loop and starts the next one; in a `for` loop the step expression still runs.

```systemverilog
for (int i = 0; i < N; i++) begin
  if (!valid[i]) continue;
  total += data[i];
end
```
