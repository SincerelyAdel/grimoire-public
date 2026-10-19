**`packed`** — contiguous bit layout

Applied to a `struct` or `union` so that it is stored as a single vector with no gaps. Packed types can be used wherever a vector can, and are what synthesis expects.

```systemverilog
typedef struct packed {
  logic [3:0] hi;
  logic [3:0] lo;
} nibbles_t;
```
