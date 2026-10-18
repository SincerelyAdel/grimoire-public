**`` `uvm_fatal ``** — report an unrecoverable problem and end the simulation

Prints a `UVM_FATAL` message and terminates the run. Use it when the testbench cannot meaningfully continue: a missing virtual interface or configuration object, a failed cast, an illegal testbench state.

**Syntax**

```systemverilog
`uvm_fatal(ID, MSG)
```

**Example**

```systemverilog
function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    if (!uvm_config_db #(virtual fifo_if.wr_driver)::get(this, "", "vif", vif))
        `uvm_fatal("FIFO_WR_DRV", "No virtual interface set for fifo_wr_driver.vif")
endfunction
```

**What happens**

The default action is `UVM_DISPLAY | UVM_EXIT`. `UVM_EXIT` calls `uvm_root::die()`, which calls `pre_abort()` on every component, prints the report summary and then calls `$finish`. The remaining phases, including `report_phase`, do not run.

**Notes**

- A fatal issued during `build_phase` is the normal outcome of a wiring mistake; UVM also raises its own fatal after the phase if any errors were reported while building.
- Do not use it for DUT mismatches. Use `` `uvm_error `` so the rest of the test still produces data.
- The message is issued at `UVM_NONE` verbosity and cannot be filtered out by verbosity.
- A `uvm_report_catcher` can demote a fatal, which is occasionally useful for testing the testbench itself.

**See also**: `uvm_error`, `uvm_warning`, `uvm_info`, `uvm_action`, `uvm_report_catcher`
