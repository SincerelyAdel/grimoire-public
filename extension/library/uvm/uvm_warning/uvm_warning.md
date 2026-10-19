**`` `uvm_warning ``** — report a suspicious condition without failing the test

Prints a `UVM_WARNING` message. Warnings are always shown (they are issued at `UVM_NONE` verbosity) and are counted in the end-of-test summary, but they do not count toward the error limit and do not fail the run on their own.

**Syntax**

```systemverilog
`uvm_warning(ID, MSG)
```

**Example**

```systemverilog
function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    if (!uvm_config_db #(fifo_cfg)::get(this, "", "cfg", cfg)) begin
        `uvm_warning("FIFO_ENV", "no cfg set, using defaults")
        cfg = fifo_cfg::type_id::create("cfg");
    end
endfunction
```

**Notes**

- Use it for conditions that are legal but probably unintended: a default taken, an item dropped, a timeout nearly hit.
- A regression can treat warnings as failures by promoting them: `set_report_severity_override(UVM_WARNING, UVM_ERROR)` or `+uvm_set_severity=*,_ALL_,UVM_WARNING,UVM_ERROR`.
- To silence one known warning, set its action to `UVM_NO_ACTION` with `set_report_id_action("ID", UVM_NO_ACTION)` or use a `uvm_report_catcher`.

**See also**: `uvm_info`, `uvm_error`, `uvm_fatal`, `uvm_severity`, `uvm_report_catcher`
