**`check_phase`** — the phase for end-of-test checks

Runs after `extract_phase`. It is a function, takes zero time, and executes bottom-up. Use it to verify conditions that can only be judged once the test is over, and report any failure with `` `uvm_error ``.

**Signature**

```systemverilog
virtual function void check_phase(uvm_phase phase);
```

**What to check**

- Expected transactions that never arrived: non-empty scoreboard queues and FIFOs.
- Activity actually happened: a test with zero comparisons must not pass.
- Counters balance: items written equals items read plus items still stored.
- Expected error scenarios really occurred, in negative tests.

**Example**

```systemverilog
function void check_phase(uvm_phase phase);
    super.check_phase(phase);

    if (expected.size() != 0)
        `uvm_error("FIFO_SCB", $sformatf("%0d expected item(s) were never read", expected.size()))

    if (n_match + n_mismatch == 0)
        `uvm_error("FIFO_SCB", "no transactions were compared")

    if (!rd_fifo.is_empty())
        `uvm_error("FIFO_SCB", $sformatf("%0d read(s) left unprocessed", rd_fifo.used()))
endfunction
```

**Notes**

- A scoreboard that only checks during the run reports a passing result for a test in which the DUT simply stopped responding. The end-of-test checks close that hole.
- Errors raised here still count toward the final result, because `report_phase` runs afterwards.
- This phase is skipped if the simulation ends early through a fatal error or the quit count.

**See also**: `extract_phase`, `report_phase`, `uvm_scoreboard`, `uvm_error`, `phase_ready_to_end`
