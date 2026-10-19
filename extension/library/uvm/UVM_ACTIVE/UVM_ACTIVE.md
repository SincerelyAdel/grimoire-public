**`UVM_ACTIVE`** — agent mode in which the agent drives its interface

A value of `uvm_active_passive_enum` (numerically 1) and the default for `uvm_agent::is_active`. An active agent creates its sequencer and driver in addition to its monitor, and connects the driver to the sequencer.

**Notes**

- Guard every use of `sqr` and `drv` with the same test, including in virtual sequencers and in the test that starts sequences; they are null when the agent is passive.
- `get_is_active()` is the accessor form of the same check and can be overridden by an agent.

**See also**: `UVM_PASSIVE`, `uvm_active_passive_enum`, `uvm_agent`, `is_active`, `get_is_active`

---

**Coding example**

```systemverilog
class fifo_wr_agent extends uvm_agent;
    `uvm_component_utils(fifo_wr_agent)

    fifo_sequencer  sqr;
    fifo_wr_driver  drv;
    fifo_wr_monitor mon;

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        mon = fifo_wr_monitor::type_id::create("mon", this);
        if (is_active == UVM_ACTIVE) begin
            sqr = fifo_sequencer::type_id::create("sqr", this);
            drv = fifo_wr_driver::type_id::create("drv", this);
        end
    endfunction

    function void connect_phase(uvm_phase phase);
        super.connect_phase(phase);
        if (is_active == UVM_ACTIVE)
            drv.seq_item_port.connect(sqr.seq_item_export);
    endfunction
endclass
```

---

**Visual**

<img src="behavior.svg" width="300">
