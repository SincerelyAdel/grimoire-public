**`uvm_report_info`** — the reporting functions behind the macros (`uvm_report_info`, `uvm_report_warning`, `uvm_report_error`, `uvm_report_fatal`)

The four functions that issue a report. The `` `uvm_info ``, `` `uvm_warning ``, `` `uvm_error `` and `` `uvm_fatal `` macros expand to calls of these, with a verbosity check in front and the file and line filled in. They are methods of `uvm_report_object`, so every component has them, and they also exist as global functions that report through `uvm_top`.

**Signatures**

```systemverilog
virtual function void uvm_report_info   (string id, string message, int verbosity = UVM_MEDIUM,
                                         string filename = "", int line = 0);
virtual function void uvm_report_warning(string id, string message, int verbosity = UVM_MEDIUM,
                                         string filename = "", int line = 0);
virtual function void uvm_report_error  (string id, string message, int verbosity = UVM_LOW,
                                         string filename = "", int line = 0);
virtual function void uvm_report_fatal  (string id, string message, int verbosity = UVM_NONE,
                                         string filename = "", int line = 0);
```

**Example**

```systemverilog
// Direct call from a component
uvm_report_info("FIFO_ENV", "environment built", UVM_LOW);

// From a module or other code with no component: the global functions
module tb_fifo;
    import uvm_pkg::*;
    initial begin
        if (!$test$plusargs("UVM_TESTNAME"))
            uvm_report_warning("TB", "no +UVM_TESTNAME given");
    end
endmodule

// Through another component, to use its settings and path
env.scb.uvm_report_error("FIFO_SCB", "reported on behalf of the scoreboard");
```

**Macro or function**

| | Macro | Function |
| --- | --- | --- |
| File and line in the message | Added automatically | Only if you pass `` `__FILE__ `` and `` `__LINE__ `` |
| Message string built when filtered out | No | Yes, always |
| Usable where a statement is expected | Yes, but it expands to an `if` block | Yes |
| Verbosity of warnings and errors | Fixed at `UVM_NONE` | Can be chosen |

Prefer the macros. The functions are for the cases the macros do not cover: a chosen verbosity on a warning or error, or reporting through a specific object.

**Notes**

- The different default verbosities of the functions mean a warning issued with `uvm_report_warning` at its default can be filtered out by `+UVM_VERBOSITY=UVM_LOW`, unlike one from the macro.
- UVM 1.2 adds optional `context_name` and `report_enabled_checked` arguments at the end.

**See also**: `uvm_info`, `uvm_warning`, `uvm_error`, `uvm_fatal`, `uvm_report_enabled`, `uvm_report_object`
