**`is_active`** — the agent property that selects active or passive mode

A member of `uvm_agent`, of type `uvm_active_passive_enum`. It decides what the agent builds: sequencer, driver and monitor when `UVM_ACTIVE`, the monitor alone when `UVM_PASSIVE`. `uvm_agent::build_phase` reads it from the configuration database, so the test controls it without touching the agent.

**Declaration** (in `uvm_agent`)

```systemverilog
uvm_active_passive_enum is_active = UVM_ACTIVE;
```

**Example**

```systemverilog
class fifo_wr_agent extends uvm_agent;
    `uvm_component_utils(fifo_wr_agent)

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);                 // reads is_active from the config database
        mon = fifo_wr_monitor::type_id::create("mon", this);
        if (is_active == UVM_ACTIVE) begin
            sqr = fifo_sequencer::type_id::create("sqr", this);
            drv = fifo_wr_driver::type_id::create("drv", this);
        end
    endfunction

    function void connect_phase(uvm_phase phase);
        super.connect_phase(phase);
        ap = mon.ap;
        if (is_active == UVM_ACTIVE)
            drv.seq_item_port.connect(sqr.seq_item_export);
    endfunction
endclass

// Test: make the write agent passive
uvm_config_db #(uvm_bitstream_t)::set(this, "env.wr_agt", "is_active", UVM_PASSIVE);
```

**Setting it: the type must match the UVM version**

| UVM version | Types the agent accepts for `"is_active"` |
| --- | --- |
| 1.1d | `uvm_bitstream_t` only (what `set_config_int` stores) |
| 1.2 and later | `uvm_active_passive_enum`, `uvm_bitstream_t`, `int`, `int unsigned`, `uvm_integral_t`, `string` |

`uvm_config_db #(uvm_bitstream_t)` works everywhere. In 1.1d, a value set as `#(uvm_active_passive_enum)` is silently ignored and the agent stays active.

**Notes**

- The value is only read if the agent calls `super.build_phase(phase)` before testing it.
- It can also be assigned directly by the parent right after `create()`, but only before the agent's own `build_phase` runs, and the configuration database is the conventional route.
- `get_is_active()` returns the same value and is the form to use from outside the agent.

**See also**: `get_is_active`, `uvm_agent`, `UVM_ACTIVE`, `UVM_PASSIVE`, `uvm_active_passive_enum`, `uvm_config_db`
