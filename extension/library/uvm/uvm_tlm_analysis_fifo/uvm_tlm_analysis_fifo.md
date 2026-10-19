**`uvm_tlm_analysis_fifo`** — an unbounded FIFO that can be written from an analysis port

Bridges the non-blocking analysis world and blocking task code. A monitor's `write()` puts the transaction into the FIFO and returns immediately; a task in the consumer calls the blocking `get()` and waits until something arrives. It is the standard building block for scoreboards that must compare streams arriving at different times.

**Declaration**

```systemverilog
class uvm_tlm_analysis_fifo #(type T = int) extends uvm_tlm_fifo #(T);
    uvm_analysis_imp #(T, uvm_tlm_analysis_fifo #(T)) analysis_export;
    function new(string name, uvm_component parent = null);
    function void write(input T t);
```

The FIFO is always unbounded, so `write` never fails.

**Main methods** (inherited from `uvm_tlm_fifo`)

| Method | Purpose |
| --- | --- |
| `get(output T t)` | Blocking: remove the next item |
| `peek(output T t)` | Blocking: look at the next item without removing it |
| `try_get(output T t)` / `try_peek(output T t)` | Non-blocking; return 0 if empty |
| `used()` | Number of items stored |
| `is_empty()` | 1 if nothing is stored |
| `flush()` | Discard everything |

**Notes**

- Connect the publisher to the FIFO's `analysis_export` member, not to the FIFO itself.
- A `forever` loop blocked in `get()` is killed when the run phase ends; check for leftovers in `check_phase`.
- Compared with `` `uvm_analysis_imp_decl ``, a FIFO costs one object per stream but lets the checker consume time and impose its own ordering.

**See also**: `uvm_tlm_fifo`, `uvm_analysis_port`, `uvm_analysis_imp`, `uvm_analysis_imp_decl`, `uvm_scoreboard`, `analysis_export`

---

**Coding example**

```systemverilog
class fifo_scoreboard extends uvm_scoreboard;
    `uvm_component_utils(fifo_scoreboard)

    uvm_tlm_analysis_fifo #(fifo_transaction) wr_fifo;
    uvm_tlm_analysis_fifo #(fifo_transaction) rd_fifo;

    function new(string name = "fifo_scoreboard", uvm_component parent = null);
        super.new(name, parent);
        wr_fifo = new("wr_fifo", this);
        rd_fifo = new("rd_fifo", this);
    endfunction

    task run_phase(uvm_phase phase);
        fifo_transaction exp, act;
        forever begin
            rd_fifo.get(act);               // wait for a read
            if (!wr_fifo.try_get(exp)) begin
                `uvm_error("FIFO_SCB", "read with no matching write")
                continue;
            end
            if (act.data !== exp.data)
                `uvm_error("FIFO_SCB", $sformatf("got 0x%0h, expected 0x%0h", act.data, exp.data))
        end
    endtask

    function void check_phase(uvm_phase phase);
        if (!wr_fifo.is_empty())
            `uvm_error("FIFO_SCB", $sformatf("%0d write(s) never read", wr_fifo.used()))
    endfunction
endclass

// Environment
wr_agt.ap.connect(scb.wr_fifo.analysis_export);
rd_agt.ap.connect(scb.rd_fifo.analysis_export);
```

---

**Visual**

<img src="behavior.svg" width="300">
