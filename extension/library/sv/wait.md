**`wait`** — block until a condition is true

`wait (expr)` suspends the process until the expression is true; if it is already true, the process continues at once. `wait fork` waits for all child processes of the current process. Not synthesizable.

```systemverilog
wait (rst_n === 1'b1);
fork
  drive();
  monitor();
join_none
wait fork;   // wait for both to finish
```
