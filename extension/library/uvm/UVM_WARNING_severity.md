**`UVM_WARNING`** — report severity: something suspicious that does not fail the test

One of the four `uvm_severity` values. It is the severity of every message issued with `` `uvm_warning ``, and the value used to query counts and to configure actions and overrides for that class of message.

| Severity | Macro | Default action |
| --- | --- | --- |
| `UVM_INFO` | `` `uvm_info `` | `UVM_DISPLAY` |
| `UVM_WARNING` | `` `uvm_warning `` | `UVM_DISPLAY` |
| `UVM_ERROR` | `` `uvm_error `` | `UVM_DISPLAY \| UVM_COUNT` |
| `UVM_FATAL` | `` `uvm_fatal `` | `UVM_DISPLAY \| UVM_EXIT` |

Warnings are always printed and are counted in the summary, but do not count toward the quit limit. A regression can promote them to errors, and a known harmless one can be silenced by ID.

**Example**

```systemverilog
int n_warn = uvm_report_server::get_server().get_severity_count(UVM_WARNING);

// Strict mode: warnings fail the test
uvm_top.set_report_severity_override(UVM_WARNING, UVM_ERROR);

// Silence one known warning
env.set_report_severity_id_action_hier(UVM_WARNING, "FIFO_ENV", UVM_NO_ACTION);
```

**See also**: `uvm_severity`, `uvm_warning`, `uvm_action`, `uvm_report_server`, `uvm_report_catcher`
