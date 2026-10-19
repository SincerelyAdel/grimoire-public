**`report_phase`** — the phase for printing results

Runs after `check_phase`. It is a function, takes zero time, and executes bottom-up. Each component prints its own summary here, and the test prints the overall PASS or FAIL.

**Signature**

```systemverilog
virtual function void report_phase(uvm_phase phase);
```

**Example**

```systemverilog
// Scoreboard: its own statistics
function void report_phase(uvm_phase phase);
    super.report_phase(phase);
    `uvm_info("FIFO_SCB", $sformatf("%0d match, %0d mismatch, %0d illegal op(s)",
                                     n_match, n_mismatch, n_illegal), UVM_LOW)
endfunction

// Test: the final verdict
function void report_phase(uvm_phase phase);
    uvm_report_server server = uvm_report_server::get_server();
    int errors = server.get_severity_count(UVM_ERROR) + server.get_severity_count(UVM_FATAL);

    super.report_phase(phase);
    if (errors == 0)
        `uvm_info("TEST", "*** TEST PASSED ***", UVM_NONE)
    else
        `uvm_info("TEST", $sformatf("*** TEST FAILED: %0d error(s) ***", errors), UVM_NONE)
endfunction
```

**Notes**

- Because the phase is bottom-up, the test's `report_phase` runs last, after every component has reported, so its verdict includes errors raised in the components' `check_phase` and `report_phase`.
- Print the verdict at `UVM_NONE` so it is never filtered out, and use a fixed string that regression scripts can search for.
- Do not put checks here; put them in `check_phase` so that all errors exist before any summary is printed.
- The library prints its own "UVM Report Summary" with the per-severity and per-ID counts after `final_phase`.
- If the run ends through a fatal or the quit count, this phase does not execute; scripts should treat a missing verdict line as a failure.

**See also**: `check_phase`, `final_phase`, `uvm_report_server`, `uvm_info`, `UVM_NONE`
