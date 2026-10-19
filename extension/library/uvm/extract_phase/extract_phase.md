**`extract_phase`** — the phase for collecting results after the run has ended

The first of the four cleanup phases, entered once all time-consuming phases have finished. It is a function, takes zero time, and executes bottom-up. Use it to gather final data from the DUT and from testbench components so that `check_phase` can judge it.

**Signature**

```systemverilog
virtual function void extract_phase(uvm_phase phase);
```

**The cleanup phases, in order**

| Phase | Purpose |
| --- | --- |
| `extract_phase` | Collect: counters, queue sizes, final DUT state, coverage numbers |
| `check_phase` | Judge: report errors for anything wrong |
| `report_phase` | Print: summaries and the PASS/FAIL result |
| `final_phase` | Close: files, external connections |

**Notes**

- No simulation time can pass. Anything that needs the clock must happen before the run phase ends.
- Small testbenches often skip this phase and do the collecting directly in `check_phase`; the split matters when several components contribute to one check.

**See also**: `check_phase`, `report_phase`, `final_phase`, `run_phase`, `uvm_scoreboard`

---

**Coding example**

```systemverilog
class fifo_scoreboard extends uvm_scoreboard;
    int unsigned n_leftover;
    int unsigned final_count;

    function void extract_phase(uvm_phase phase);
        uvm_hdl_data_t value;
        super.extract_phase(phase);

        n_leftover = expected.size();
        if (uvm_hdl_read("tb_fifo.dut.count_q", value))
            final_count = value;
    endfunction

    function void check_phase(uvm_phase phase);
        if (n_leftover != final_count)
            `uvm_error("FIFO_SCB", $sformatf("model holds %0d item(s), DUT holds %0d",
                                              n_leftover, final_count))
    endfunction
endclass
```

---

**Visual**

<img src="behavior.svg" width="300">
