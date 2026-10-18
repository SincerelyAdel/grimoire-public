**`union`** — overlapping views of the same storage

All members share the same bits, so one value can be read in several formats. A `packed` union requires every member to have the same width.

```systemverilog
typedef union packed {
  logic [31:0]     word;
  logic [3:0][7:0] bytes;
} word_u;
```
