**`while`** — loop that tests before each pass

Repeats the statement while the condition is true; if the condition is false at the start, the body never runs. Use `do ... while` when the body must run at least once. A `while` that never waits on time or an event hangs the simulator.

```systemverilog
while (!fifo.empty()) begin
  item = fifo.pop_front();
  process(item);
end
```
