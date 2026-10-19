**`UVM_FATAL`** — report severity: an unrecoverable failure that ends the simulation

One of the four `uvm_severity` values. It is the severity of every message issued with `` `uvm_fatal ``, and the value used to query counts and to configure actions and overrides for that class of message.

| Severity | Macro | Default action |
| --- | --- | --- |
| `UVM_INFO` | `` `uvm_info `` | `UVM_DISPLAY` |
| `UVM_WARNING` | `` `uvm_warning `` | `UVM_DISPLAY` |
| `UVM_ERROR` | `` `uvm_error `` | `UVM_DISPLAY \| UVM_COUNT` |
| `UVM_FATAL` | `` `uvm_fatal `` | `UVM_DISPLAY \| UVM_EXIT` |

The `UVM_EXIT` action ends the run immediately: `pre_abort()` is called on every component, the report summary is printed and `$finish` is called. The remaining phases do not execute.

**Example**

```systemverilog
int n_fatal = uvm_report_server::get_server().get_severity_count(UVM_FATAL);

// Keep going after a specific fatal, when testing the testbench itself
env.wr_agt.drv.set_report_severity_id_action(UVM_FATAL, "FIFO_WR_DRV", UVM_DISPLAY | UVM_COUNT);
```

**See also**: `uvm_severity`, `uvm_fatal`, `uvm_action`, `uvm_report_server`, `uvm_report_catcher`
