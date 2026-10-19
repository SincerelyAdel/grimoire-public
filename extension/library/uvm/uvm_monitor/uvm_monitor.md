**`uvm_monitor`** — base class for the component that observes an interface

A monitor watches DUT pins, rebuilds transactions from what it sees and publishes them on an analysis port. It never drives anything. Scoreboards, coverage collectors and reference models all get their data from monitors, never from drivers, so the checking works the same whether the agent is active or passive.

**Declaration**

```systemverilog
virtual class uvm_monitor extends uvm_component;
    function new(string name, uvm_component parent);
```

It adds nothing to `uvm_component`; the analysis port is yours to declare.

**Guidelines**

- Create a new transaction object for each observation. Reusing one object corrupts every subscriber that kept the handle.
- Sample through a clocking block with input skew so the monitor sees stable values.
- Report only what was observed on the pins. Do not peek at the driver or the sequence.
- Put protocol checks and interface coverage here or in the interface itself, so they work in passive mode too.
- `ap.write()` is a function and returns immediately; subscribers must not block.

**See also**: `uvm_analysis_port`, `uvm_driver`, `uvm_agent`, `uvm_scoreboard`, `uvm_subscriber`, `run_phase`

---

**Coding example**

```systemverilog
class fifo_wr_monitor extends uvm_monitor;
    `uvm_component_utils(fifo_wr_monitor)

    virtual fifo_if.wr_monitor vif;
    uvm_analysis_port #(fifo_transaction) ap;

    function new(string name = "fifo_wr_monitor", uvm_component parent = null);
        super.new(name, parent);
        ap = new("ap", this);
    endfunction

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        if (!uvm_config_db #(virtual fifo_if.wr_monitor)::get(this, "", "vif", vif))
            `uvm_fatal("FIFO_WR_MON", "No virtual interface set for fifo_wr_monitor.vif")
    endfunction

    task run_phase(uvm_phase phase);
        fifo_transaction tr;
        forever begin
            @(vif.wr_mon_cb);
            if (vif.rst_n && vif.wr_mon_cb.wr_en) begin
                tr = fifo_transaction::type_id::create("tr");
                tr.data  = vif.wr_mon_cb.data_in;
                tr.legal = !vif.wr_mon_cb.full;
                `uvm_info("FIFO_WR_MON", tr.convert2string(), UVM_HIGH)
                ap.write(tr);
            end
        end
    endtask
endclass
```

---

**Visual**

<img src="behavior.svg" width="300">
