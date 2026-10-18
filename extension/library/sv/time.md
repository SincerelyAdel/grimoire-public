**`time`** — 64-bit unsigned 4-state time value

Holds simulation times as returned by `$time`, scaled to the current time unit. Fractions are lost; use `realtime` with `$realtime` to keep them.

```systemverilog
time start = $time;
```
