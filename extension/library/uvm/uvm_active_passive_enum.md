**`uvm_active_passive_enum`** — whether an agent drives its interface or only observes it

The type of `uvm_agent::is_active`. An active agent builds a sequencer and a driver as well as a monitor; a passive agent builds only the monitor.

**Declaration**

```systemverilog
typedef enum bit { UVM_PASSIVE = 0, UVM_ACTIVE = 1 } uvm_active_passive_enum;
```

| Value | Agent contents | Use when |
| --- | --- | --- |
| `UVM_ACTIVE` | Sequencer, driver, monitor | The testbench must generate traffic on this interface |
| `UVM_PASSIVE` | Monitor only | Real RTL drives the interface and the testbench only checks and covers it |

**Example**

```systemverilog
// Agent
function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    mon = fifo_wr_monitor::type_id::create("mon", this);
    if (get_is_active() == UVM_ACTIVE) begin
        sqr = fifo_sequencer::type_id::create("sqr", this);
        drv = fifo_wr_driver::type_id::create("drv", this);
    end
endfunction

// Test or higher-level environment
uvm_config_db #(uvm_bitstream_t)::set(this, "env.wr_agt", "is_active", UVM_PASSIVE);
```

**Notes**

- The default is `UVM_ACTIVE`.
- Block-level environments are typically all active; when the block is integrated, the interfaces now driven by neighbouring RTL become passive while the checkers keep working.
- See `uvm_agent` for the type that must be used in the configuration database in each UVM version.

**See also**: `UVM_ACTIVE`, `UVM_PASSIVE`, `uvm_agent`, `is_active`, `get_is_active`
