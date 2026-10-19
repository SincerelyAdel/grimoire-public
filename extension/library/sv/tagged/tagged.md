**`tagged`** — union that records which member is valid

`union tagged` stores a hidden tag with the value, so only the member last written can be read; reading another is an error. Construct values with `tagged Member value` and read them with pattern matching.

```systemverilog
typedef union tagged {
  logic [31:0] Addr;
  void         None;
} opt_addr_t;

opt_addr_t a = tagged Addr 32'h40;
```
