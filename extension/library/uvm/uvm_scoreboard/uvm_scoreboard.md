**`uvm_scoreboard`** — base class for the component that checks DUT behaviour

A scoreboard receives observed transactions from monitors through analysis connections, predicts or looks up what the DUT should have done, and reports mismatches. The base class adds nothing to `uvm_component`; it marks the role.

**Declaration**

```systemverilog
virtual class uvm_scoreboard extends uvm_component;
    function new(string name, uvm_component parent);
```

**Example: in-order comparison with two input streams**

```systemverilog
`uvm_analysis_imp_decl(_wr)
`uvm_analysis_imp_decl(_rd)

class fifo_scoreboard extends uvm_scoreboard;
    `uvm_component_utils(fifo_scoreboard)

    uvm_analysis_imp_wr #(fifo_transaction, fifo_scoreboard) wr_ap;
    uvm_analysis_imp_rd #(fifo_transaction, fifo_scoreboard) rd_ap;

    fifo_transaction expected[$];
    int unsigned     n_match, n_mismatch;

    function new(string name = "fifo_scoreboard", uvm_component parent = null);
        super.new(name, parent);
        wr_ap = new("wr_ap", this);
        rd_ap = new("rd_ap", this);
    endfunction

    function void write_wr(fifo_transaction tr);
        if (tr.legal) expected.push_back(tr);
    endfunction

    function void write_rd(fifo_transaction tr);
        fifo_transaction exp;
        if (!tr.legal) return;
        if (expected.size() == 0) begin
            `uvm_error("FIFO_SCB", "read with nothing expected")
            return;
        end
        exp = expected.pop_front();
        if (tr.data === exp.data) n_match++;
        else begin
            n_mismatch++;
            `uvm_error("FIFO_SCB", $sformatf("got 0x%0h, expected 0x%0h", tr.data, exp.data))
        end
    endfunction

    function void check_phase(uvm_phase phase);
        if (expected.size() != 0)
            `uvm_error("FIFO_SCB", $sformatf("%0d item(s) never read", expected.size()))
    endfunction

    function void report_phase(uvm_phase phase);
        `uvm_info("FIFO_SCB", $sformatf("%0d match, %0d mismatch", n_match, n_mismatch), UVM_LOW)
    endfunction
endclass
```

**Two common structures**

| Structure | How |
| --- | --- |
| Function-based | `uvm_analysis_imp` with `write()` functions, as above. Simple, no time may pass. |
| Task-based | One `uvm_tlm_analysis_fifo` per stream; a `run_phase` loop calls `get()` on each and compares. Needed when the check has to wait. |

**Guidelines**

- Feed it only from monitors, so the check is independent of the stimulus.
- Do end-of-test checks (leftover expected items, minimum transaction counts) in `check_phase`, and print the summary in `report_phase`.
- Use `===` / `!==` so X and Z differences are caught.
- For out-of-order protocols, index expected items in an associative array keyed by ID.

**See also**: `uvm_analysis_imp`, `uvm_analysis_imp_decl`, `uvm_tlm_analysis_fifo`, `uvm_subscriber`, `uvm_monitor`, `check_phase`, `report_phase`
