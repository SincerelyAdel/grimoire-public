**`first_match`** — keep only the earliest match of a sequence

A sequence with a range, such as `##[1:5]`, can match more than once; `first_match(seq)` keeps only the first. Avoids multiple threads and unexpected failures in implications.

```systemverilog
assert property (@(posedge clk)
  req |-> first_match(##[1:5] gnt) ##1 data_valid);
```
