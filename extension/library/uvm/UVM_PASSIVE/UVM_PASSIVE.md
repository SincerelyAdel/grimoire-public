**`UVM_PASSIVE`** — agent mode in which the agent only monitors its interface

A value of `uvm_active_passive_enum` (numerically 0). A passive agent creates only its monitor. It drives nothing, so it can be attached to an interface that real RTL is driving, and its monitor still feeds scoreboards, coverage and protocol checks.

**Notes**

- In passive mode the agent's `sqr` and `drv` handles are null. Starting a sequence on a null sequencer is a fatal error.
- Everything needed for checking must live in the monitor, never in the driver, or it disappears in passive mode.
- The interface signals must not be driven from the testbench side in passive mode; make sure the virtual interface modport or the top-level wiring reflects that.

**See also**: `UVM_ACTIVE`, `uvm_active_passive_enum`, `uvm_agent`, `is_active`, `get_is_active`, `uvm_monitor`

---

**Coding example**

```systemverilog
// Chip-level test: the FIFO's write side is now driven by an upstream block
function void build_phase(uvm_phase phase);
    uvm_config_db #(uvm_bitstream_t)::set(this, "env.fifo_env.wr_agt", "is_active", UVM_PASSIVE);
    super.build_phase(phase);
endfunction

// Code that starts stimulus must skip passive agents
task run_phase(uvm_phase phase);
    phase.raise_objection(this);
    if (env.fifo_env.wr_agt.get_is_active() == UVM_ACTIVE)
        wr_seq.start(env.fifo_env.wr_agt.sqr);
    phase.drop_objection(this);
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
