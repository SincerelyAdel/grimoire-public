**`uvm_analysis_port`** — broadcast a transaction to any number of subscribers

The publishing end of the analysis interface. A monitor calls `write(tr)` on its analysis port, and the port calls `write(tr)` on every component connected to it: scoreboards, coverage collectors, reference models. The publisher does not know or care how many subscribers there are, including none.

**Declaration**

```systemverilog
class uvm_analysis_port #(type T = int) extends uvm_port_base #(uvm_tlm_if_base #(T, T));
    function new(string name, uvm_component parent);
    function void write(input T t);
```

**Example**

```systemverilog
class fifo_wr_monitor extends uvm_monitor;
    `uvm_component_utils(fifo_wr_monitor)

    uvm_analysis_port #(fifo_transaction) ap;

    function new(string name = "fifo_wr_monitor", uvm_component parent = null);
        super.new(name, parent);
        ap = new("ap", this);
    endfunction

    task run_phase(uvm_phase phase);
        fifo_transaction tr;
        forever begin
            @(vif.wr_mon_cb iff vif.wr_mon_cb.wr_en);
            tr = fifo_transaction::type_id::create("tr");
            tr.data = vif.wr_mon_cb.data_in;
            ap.write(tr);
        end
    endtask
endclass

// Agent: forward the monitor's port upward
ap = mon.ap;                         // share the handle, or
mon.ap.connect(ap);                  // connect port to port

// Environment: one port, several subscribers
wr_agt.ap.connect(scb.wr_ap);
wr_agt.ap.connect(cov.analysis_export);
```

**Connection rules**

| From | To | Meaning |
| --- | --- | --- |
| port | port | Pass up through a parent (child's port to parent's port) |
| port | export | Pass down into a child component |
| port | imp | Final destination that implements `write` |
| export | export or imp | Continue downward to the implementation |

Always call `connect` on the initiator side: `publisher.connect(subscriber)`.

**Notes**

- `write` is a function. It takes no simulation time and subscribers must not block. A subscriber that needs to wait should receive through a `uvm_tlm_analysis_fifo`.
- Every subscriber receives the same object handle. None of them may modify it; clone first if you need to.
- An analysis port with no connection is legal, unlike other TLM ports, which require at least one.
- Analysis ports are constructed with `new`, not through the factory, usually in the constructor or `build_phase`.

**See also**: `uvm_analysis_imp`, `uvm_analysis_export`, `uvm_tlm_analysis_fifo`, `uvm_analysis_imp_decl`, `uvm_subscriber`, `uvm_monitor`, `connect_phase`
