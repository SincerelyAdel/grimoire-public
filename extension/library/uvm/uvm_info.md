**`` `uvm_info ``** — print an informational message, filtered by verbosity

The standard way to print from a testbench. The message is shown only if its verbosity is at or below the reporting component's current verbosity threshold, so chatty debug output can stay in the code and be switched on from the command line.

**Syntax**

```systemverilog
`uvm_info(ID, MSG, VERBOSITY)
```

| Argument | Meaning |
| --- | --- |
| `ID` | A short string tag for the message. Reports are counted and can be filtered per ID. |
| `MSG` | The message string, usually built with `$sformatf`. |
| `VERBOSITY` | `UVM_NONE`, `UVM_LOW`, `UVM_MEDIUM`, `UVM_HIGH`, `UVM_FULL` or `UVM_DEBUG`. |

**How filtering works**

A message is printed when `VERBOSITY <= threshold`. The default threshold is `UVM_MEDIUM`, so `UVM_HIGH` and above are hidden unless you raise it with `+UVM_VERBOSITY=UVM_HIGH` or `set_report_verbosity_level()`.

| Level | Typical use |
| --- | --- |
| `UVM_NONE` | Always printed: test result, critical summaries |
| `UVM_LOW` | Key milestones: reset done, test phase changes |
| `UVM_MEDIUM` | Per-transaction summaries |
| `UVM_HIGH` | Detailed per-transaction dumps |
| `UVM_FULL` / `UVM_DEBUG` | Signal-level tracing |

**Example**

```systemverilog
task run_phase(uvm_phase phase);
    forever begin
        seq_item_port.get_next_item(req);
        `uvm_info("FIFO_WR_DRV", $sformatf("driving %s", req.convert2string()), UVM_HIGH)
        drive_item(req);
        seq_item_port.item_done();
    end
endtask
```

Output:

```
UVM_INFO fifo_wr_driver.sv(31) @ 125: uvm_test_top.env.wr_agt.drv [FIFO_WR_DRV] driving data=0x3c delay=2
```

**Notes**

- The macro checks `uvm_report_enabled()` before evaluating `MSG`, so a filtered-out `$sformatf` costs nothing. Calling `uvm_report_info()` directly always builds the string.
- It adds the file name and line number automatically.
- No trailing semicolon is needed; adding one is harmless inside a `begin`/`end` but breaks an unbraced `if`/`else`.
- Inside a sequence or other `uvm_object`, the message is routed through the sequencer or `uvm_top`. Use `` `uvm_info_context `` to report through a specific component.

**See also**: `uvm_warning`, `uvm_error`, `uvm_fatal`, `UVM_VERBOSITY`, `uvm_verbosity`, `set_report_verbosity_level`
