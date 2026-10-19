**`uvm_report_enabled`** — test whether a message would be printed

Returns 1 if a report with the given verbosity, severity and ID would pass the current filters of this report object, that is, its verbosity is within the threshold and its action is not `UVM_NO_ACTION`. Use it to skip expensive work that only produces debug output.

**Signature**

```systemverilog
function bit uvm_report_enabled(int verbosity, uvm_severity severity = UVM_INFO, string id = "");
```

**Example**

```systemverilog
function void write_rd(fifo_transaction tr);
    // Dumping the whole expected queue is costly: only do it when it will be shown
    if (uvm_report_enabled(UVM_FULL, UVM_INFO, "FIFO_SCB")) begin
        string dump = "";
        foreach (expected[i]) dump = {dump, "\n  ", expected[i].convert2string()};
        `uvm_info("FIFO_SCB", {"expected queue:", dump}, UVM_FULL)
    end
    compare(tr);
endfunction

// Enable a debug-only check at high verbosity
if (uvm_report_enabled(UVM_DEBUG))
    check_internal_consistency();
```

**Notes**

- The `` `uvm_info `` macro already makes this check before evaluating its message argument, so wrapping a single macro call in it gains nothing. It pays off when several statements build the message, as above.
- A global function of the same name performs the check against `uvm_top`, for code outside any component.
- It takes the severity and ID into account, so per-ID verbosity settings and silenced IDs are honoured.

**See also**: `uvm_info`, `uvm_report_info`, `uvm_verbosity`, `set_report_verbosity_level`, `uvm_report_object`
