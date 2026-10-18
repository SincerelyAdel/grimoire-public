**`` `uvm_error ``** — report a checker failure and keep simulating

Prints a `UVM_ERROR` message and increments the error count. Simulation continues, so one run can report many mismatches. The test is considered failed if the count is non-zero at the end.

**Syntax**

```systemverilog
`uvm_error(ID, MSG)
```

**Example**

```systemverilog
function void write_rd(fifo_transaction tr);
    fifo_transaction exp;
    if (expected.size() == 0) begin
        `uvm_error("FIFO_SCB", $sformatf("read of 0x%0h with nothing expected", tr.data))
        return;
    end
    exp = expected.pop_front();
    if (tr.data !== exp.data)
        `uvm_error("FIFO_SCB", $sformatf("data mismatch: got 0x%0h, expected 0x%0h", tr.data, exp.data))
endfunction
```

**Notes**

- Default actions are `UVM_DISPLAY | UVM_COUNT`. Once the count reaches the quit limit, the run ends through `$finish`. Set the limit with `+UVM_MAX_QUIT_COUNT=10` or `uvm_report_server::set_max_quit_count()`; the default of 0 means no limit.
- Read the final count in `report_phase` with `uvm_report_server::get_server().get_severity_count(UVM_ERROR)` to print a PASS/FAIL line.
- Use `` `uvm_fatal `` instead when continuing makes no sense, such as a missing virtual interface.
- An expected error in a negative test can be demoted with a `uvm_report_catcher`.

**See also**: `uvm_fatal`, `uvm_warning`, `uvm_report_server`, `UVM_MAX_QUIT_COUNT`, `report_phase`
