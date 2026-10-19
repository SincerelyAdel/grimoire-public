**`realtime`** — time value stored as real

Same as `real`, meant for time values with fractional units, as returned by `$realtime`.

```systemverilog
realtime t0 = $realtime;
#1.5;
$display("elapsed %0.3f", $realtime - t0);
```
