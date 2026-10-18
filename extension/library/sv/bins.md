**`bins`** — buckets of values in a coverpoint

Defines named groups of values, transitions (`(a => b)`) or ranges to count. `bins x[] = {...}` makes one bin per value; `bins x[4] = {[0:255]}` splits a range into four. `default` collects everything else.

```systemverilog
coverpoint state {
  bins idle       = {IDLE};
  bins busy[]     = {READ, WRITE};
  bins rd_then_wr = (READ => WRITE);
}
```
