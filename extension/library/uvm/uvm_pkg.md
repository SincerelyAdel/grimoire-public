**`uvm_pkg`** — the package that contains the whole UVM class library

Every UVM class, type, enum value and global function lives in this one package: `uvm_component`, `uvm_sequence`, `uvm_config_db`, `UVM_ACTIVE`, `run_test()` and the rest. Importing it is the first line of any UVM file.

**Usage**

```systemverilog
import uvm_pkg::*;
`include "uvm_macros.svh"

module tb_fifo;
    initial run_test();
endmodule
```

**Notes**

- A wildcard import only brings in names that are actually used and never overrides a local declaration with the same name.
- Import it inside your own package, not at `$unit` scope, so that it does not leak into every file in the compilation unit.
- The macros are separate: add `` `include "uvm_macros.svh" `` as well.
- The simulator compiles the package for you when asked: `xrun -uvm` (Xcelium), `-ntb_opts uvm` (VCS), or a precompiled library in Questa. With Xcelium, `-uvmhome` selects the version, for example `CDNS-1.1d` or `CDNS-1.2`.
- An explicit reference such as `uvm_pkg::uvm_config_db` works without any import.

**See also**: `uvm_macros`, `run_test`, `uvm_root`
