**`uvm_agent`** — base class for an agent, the verification component for one interface

An agent bundles the three components that handle a single interface: a sequencer and a driver that generate activity, and a monitor that observes it. It can be active (all three) or passive (monitor only), which lets the same agent drive a block-level interface and merely watch it once the real neighbouring block is present.

**Declaration**

```systemverilog
virtual class uvm_agent extends uvm_component;
    uvm_active_passive_enum is_active = UVM_ACTIVE;
    function new(string name, uvm_component parent);
    virtual function uvm_active_passive_enum get_is_active();
```

`uvm_agent::build_phase` reads `is_active` from the configuration database, so `super.build_phase(phase)` must be called first.

**Example**

```systemverilog
class fifo_wr_agent extends uvm_agent;
    `uvm_component_utils(fifo_wr_agent)

    fifo_sequencer  sqr;
    fifo_wr_driver  drv;
    fifo_wr_monitor mon;
    uvm_analysis_port #(fifo_transaction) ap;

    function new(string name = "fifo_wr_agent", uvm_component parent = null);
        super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);                  // picks up is_active
        mon = fifo_wr_monitor::type_id::create("mon", this);
        if (get_is_active() == UVM_ACTIVE) begin
            sqr = fifo_sequencer::type_id::create("sqr", this);
            drv = fifo_wr_driver::type_id::create("drv", this);
        end
    endfunction

    function void connect_phase(uvm_phase phase);
        super.connect_phase(phase);
        ap = mon.ap;
        if (get_is_active() == UVM_ACTIVE)
            drv.seq_item_port.connect(sqr.seq_item_export);
    endfunction
endclass
```

Make it passive from the test:

```systemverilog
uvm_config_db #(uvm_bitstream_t)::set(this, "env.wr_agt", "is_active", UVM_PASSIVE);
```

**Guidelines**

- The monitor is always built and must not depend on the driver, so the agent stays useful when passive.
- Expose one analysis port on the agent that forwards the monitor's port, so the environment never reaches inside.
- Starting a sequence on a passive agent's sequencer is a null-handle error; guard it with `get_is_active()`.
- The type used in the database matters. UVM 1.1d reads `is_active` with `get_config_int`, which only matches `uvm_config_db #(uvm_bitstream_t)` (or the legacy `set_config_int`); a value set as `#(uvm_active_passive_enum)` or `#(int)` is silently ignored. UVM 1.2 also accepts the enum, `int` and string forms. `uvm_bitstream_t` works in both.

**See also**: `is_active`, `get_is_active`, `UVM_ACTIVE`, `UVM_PASSIVE`, `uvm_driver`, `uvm_monitor`, `uvm_sequencer`, `uvm_env`
