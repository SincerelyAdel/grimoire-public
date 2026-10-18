**`UVM_INFO`** — report severity: informational message

One of the four `uvm_severity` values. It is the severity of every message issued with `` `uvm_info ``, and the value used to query counts and to configure actions and overrides for that class of message.

| Severity | Macro | Default action |
| --- | --- | --- |
| `UVM_INFO` | `` `uvm_info `` | `UVM_DISPLAY` |
| `UVM_WARNING` | `` `uvm_warning `` | `UVM_DISPLAY` |
| `UVM_ERROR` | `` `uvm_error `` | `UVM_DISPLAY \| UVM_COUNT` |
| `UVM_FATAL` | `` `uvm_fatal `` | `UVM_DISPLAY \| UVM_EXIT` |

It is the only severity filtered by verbosity: an info is printed when its verbosity is at or below the threshold. It is also the default severity argument of `uvm_report_enabled()` and `get_report_verbosity_level()`.

**Example**

```systemverilog
int n_info = uvm_report_server::get_server().get_severity_count(UVM_INFO);

// Also log every info from the scoreboard to a file
env.scb.set_report_severity_action(UVM_INFO, UVM_DISPLAY | UVM_LOG);

// Skip expensive formatting when the message would be filtered
if (uvm_report_enabled(UVM_HIGH, UVM_INFO, "FIFO_SCB"))
    dump_expected_queue();
```

**See also**: `uvm_severity`, `uvm_info`, `uvm_action`, `uvm_report_server`, `uvm_report_catcher`
