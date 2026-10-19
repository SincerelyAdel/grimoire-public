**`analysis_export`** — the built-in analysis input of a subscriber or analysis FIFO

The conventional name of the member that receives analysis transactions. `uvm_subscriber` and `uvm_tlm_analysis_fifo` both declare one, and it is the usual name for an export on a user component. Connect an analysis port to it to deliver transactions.

**Where it is declared**

| Class | Declaration |
| --- | --- |
| `uvm_subscriber #(T)` | `uvm_analysis_imp #(T, this_type) analysis_export;` calls your `write()` |
| `uvm_tlm_analysis_fifo #(T)` | `uvm_analysis_imp #(T, uvm_tlm_analysis_fifo #(T)) analysis_export;` stores into the FIFO |

**Example**

```systemverilog
function void connect_phase(uvm_phase phase);
    super.connect_phase(phase);
    wr_agt.ap.connect(cov.analysis_export);              // uvm_subscriber
    wr_agt.ap.connect(scb.wr_fifo.analysis_export);      // uvm_tlm_analysis_fifo
    rd_agt.ap.connect(scb.rd_fifo.analysis_export);
endfunction
```

**Notes**

- In both library classes the member is an imp, even though it is called an export. The name describes its role at the component boundary.
- The publisher is always the caller: `port.connect(x.analysis_export)`.
- A common mistake is connecting to the FIFO or subscriber object itself (`ap.connect(scb.wr_fifo)`), which does not compile.

**See also**: `uvm_analysis_export`, `uvm_analysis_imp`, `uvm_analysis_port`, `uvm_subscriber`, `uvm_tlm_analysis_fifo`
