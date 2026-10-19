**`import`** — bring package names into scope

Makes package members visible without the `pkg::` prefix. `pkg::*` imports names on demand and `pkg::name` imports exactly one. Importing inside the module, not at file level, keeps the names out of the global scope.

```systemverilog
module top;
  import bus_pkg::*;
  byte_t data;
endmodule
```
