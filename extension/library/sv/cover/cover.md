**`cover`** — record that a behaviour happened

`cover property` counts each time a property or sequence matches, to show that a scenario was exercised. Formal tools try to find a trace that reaches it. `cover` with a plain expression is an immediate cover statement.

```systemverilog
cov_back_to_back : cover property (@(posedge clk) wr ##1 wr ##1 wr);
```
