**`binsof`** — select bins of a coverpoint in a cross

Used in a `cross` to pick bins of one coverpoint, often with `intersect` and with `ignore_bins` or `illegal_bins` to filter combinations.

```systemverilog
x_rw : cross cp_kind, cp_len {
  ignore_bins no_long_reads = binsof(cp_kind) intersect {READ} &&
                              binsof(cp_len.big);
}
```
