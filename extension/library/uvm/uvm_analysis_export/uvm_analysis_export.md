**`uvm_analysis_export`** — pass an analysis connection down into a child component

An export does not implement `write` itself. It forwards the connection to an imp, or to another export, further down the hierarchy. A parent component uses one to offer an analysis input at its boundary while the actual receiver is a child inside it.

**Declaration**

```systemverilog
class uvm_analysis_export #(type T = int) extends uvm_port_base #(uvm_tlm_if_base #(T, T));
    function new(string name, uvm_component parent = null);
```

**Port, export, imp**

| Kind | Role |
| --- | --- |
| `uvm_analysis_port` | Initiator: calls `write` |
| `uvm_analysis_export` | Pass-through on the receiving side of a boundary |
| `uvm_analysis_imp` | Terminator: implements `write` |

**Notes**

- A `uvm_tlm_analysis_fifo` exposes an `analysis_export` member, and `uvm_subscriber` has one too, so "connect to the export" is the usual way to feed either.
- An export must eventually lead to an imp; an unconnected export fails the connection check at end of elaboration.

**See also**: `uvm_analysis_port`, `uvm_analysis_imp`, `analysis_export`, `uvm_tlm_analysis_fifo`, `uvm_subscriber`

---

**Coding example**

```systemverilog
class fifo_checker extends uvm_env;
    `uvm_component_utils(fifo_checker)

    uvm_analysis_export #(fifo_transaction) wr_export;
    uvm_analysis_export #(fifo_transaction) rd_export;

    fifo_scoreboard scb;
    fifo_coverage   cov;

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        wr_export = new("wr_export", this);
        rd_export = new("rd_export", this);
        scb = fifo_scoreboard::type_id::create("scb", this);
        cov = fifo_coverage::type_id::create("cov", this);
    endfunction

    function void connect_phase(uvm_phase phase);
        wr_export.connect(scb.wr_ap);              // export -> imp
        wr_export.connect(cov.analysis_export);    // one export, two receivers
        rd_export.connect(scb.rd_ap);
    endfunction
endclass

// One level up:
wr_agt.ap.connect(chk.wr_export);                  // port -> export
```

---

**Visual**

<img src="behavior.svg" width="300">
