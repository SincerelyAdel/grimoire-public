**`disable`** — stop a named block, task or fork

`disable name;` ends the named block or task, including any processes it started, and continues after it. `disable fork;` kills all child processes of the current process. In assertions, `disable iff (expr)` stops evaluating the property while the expression is true.

```systemverilog
fork : timeout_guard
  begin wait (done); end
  begin #1000 $error("timeout"); end
join_any
disable timeout_guard;
```
