**`uvm_hdl_read`** — DPI functions for reading and forcing HDL signals by path string (`uvm_hdl_*`)

A set of global functions that reach into the design by hierarchical path given as a string. The register layer uses them for backdoor access, and testbench code can call them directly to probe or force a signal whose path is only known at run time.

**The functions**

```systemverilog
import "DPI-C" function int uvm_hdl_check_path(string path);
import "DPI-C" function int uvm_hdl_read      (string path, output uvm_hdl_data_t value);
import "DPI-C" function int uvm_hdl_deposit   (string path, uvm_hdl_data_t value);
import "DPI-C" function int uvm_hdl_force     (string path, uvm_hdl_data_t value);
import "DPI-C" function int uvm_hdl_release   (string path);
import "DPI-C" function int uvm_hdl_release_and_read(string path, inout uvm_hdl_data_t value);
task uvm_hdl_force_time(string path, uvm_hdl_data_t value, time force_time = 0);
```

| Function | Effect |
| --- | --- |
| `uvm_hdl_check_path` | 1 if the path exists |
| `uvm_hdl_read` | Read the current value |
| `uvm_hdl_deposit` | Set the value once; the design can overwrite it later |
| `uvm_hdl_force` | Hold the value until released |
| `uvm_hdl_release` | Remove a force |
| `uvm_hdl_force_time` | Force for a duration, then release |

Each returns 1 on success and 0 on failure.

**Example**

```systemverilog
task check_internal_count(int unsigned expected);
    uvm_hdl_data_t value;
    string path = "tb_fifo.dut.count_q";

    if (!uvm_hdl_check_path(path))
        `uvm_fatal("HDL", {"path not found: ", path})
    if (!uvm_hdl_read(path, value))
        `uvm_error("HDL", {"read failed: ", path})
    else if (value != expected)
        `uvm_error("HDL", $sformatf("count_q is %0d, expected %0d", value, expected))
endtask

// Error injection
void'(uvm_hdl_force("tb_fifo.dut.full", 1'b1));
#100ns;
void'(uvm_hdl_release("tb_fifo.dut.full"));
```

**Notes**

- The simulator must keep the signals accessible. With Xcelium compile with read/write access, for example `-access +rw` or `-uvmaccess`; with VCS use `-debug_access+all` or a narrower option.
- `uvm_hdl_data_t` is `UVM_HDL_MAX_WIDTH` bits wide, 1024 by default.
- If UVM is compiled with `UVM_HDL_NO_DPI`, or the DPI library is not loaded (`-uvmnoloaddpi`), these functions report an error and return 0.
- A hard-coded path ties the test to one hierarchy. Prefer the register model's backdoor (`peek`, `poke`) or an interface signal where one exists.

**See also**: `uvm_reg`, `uvm_mem`, `uvm_path_e`, `uvm_reg_block`
