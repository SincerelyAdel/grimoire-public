**`uvm_status_e`** — result of a register-layer access (`UVM_IS_OK`, `UVM_NOT_OK`, `UVM_HAS_X`)

Every register or memory access task returns one of these through its `status` argument. It tells the caller whether the operation completed, and for reads whether the value can be trusted.

**Declaration**

```systemverilog
typedef enum {
    UVM_IS_OK,
    UVM_NOT_OK,
    UVM_HAS_X
} uvm_status_e;
```

| Value | Meaning |
| --- | --- |
| `UVM_IS_OK` | The operation completed successfully |
| `UVM_NOT_OK` | The operation failed: bus error, no sequencer, access not allowed by the map |
| `UVM_HAS_X` | The operation completed but the data contains X or Z bits |

**Example**

```systemverilog
task body();
    uvm_status_e   status;
    uvm_reg_data_t value;

    regmodel.ctrl.write(status, 32'h1, .parent(this));
    if (status != UVM_IS_OK)
        `uvm_error("REG_SEQ", $sformatf("write to ctrl failed: %s", status.name()))

    regmodel.status.read(status, value, .parent(this));
    case (status)
        UVM_IS_OK:  `uvm_info("REG_SEQ", $sformatf("status = 0x%0h", value), UVM_MEDIUM)
        UVM_HAS_X:  `uvm_warning("REG_SEQ", "status register read back X")
        UVM_NOT_OK: `uvm_error("REG_SEQ", "read of status failed")
    endcase
endtask
```

**Where the value comes from**

For a frontdoor access the adapter's `bus2reg` sets `rw.status` from the bus response. If `bus2reg` never assigns it, accesses are reported as failed, which is a common adapter bug.

**See also**: `uvm_reg`, `uvm_reg_adapter`, `uvm_reg_bus_op`, `uvm_reg_item`, `uvm_path_e`
