**`struct`** — group of named members

Bundles several fields into one type. Add `packed` to make it a contiguous vector that can be assigned, sliced and used on ports like any other vector; the first member sits in the most significant bits.

```systemverilog
typedef struct packed {
  logic [7:0] data;
  logic       valid;
} beat_t;
```
