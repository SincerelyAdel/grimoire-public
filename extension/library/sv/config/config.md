**`config`** — library mapping for elaboration

A `config` block chooses which library or view to use for each cell or instance when elaborating, for example gate-level for one block and RTL for the rest. Ends with `endconfig`. Supported mainly by simulators.

```systemverilog
config cfg_mixed;
  design rtl_lib.top;
  default liblist rtl_lib;
  instance top.u_core liblist gate_lib;
endconfig
```
