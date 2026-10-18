**`UVM_ERROR`** — report severity: a failure, after which simulation continues

One of the four `uvm_severity` values. It is the severity of every message issued with `` `uvm_error ``, and the value used to query counts and to configure actions and overrides for that class of message.

| Severity | Macro | Default action |
| --- | --- | --- |
| `UVM_INFO` | `` `uvm_info `` | `UVM_DISPLAY` |
| `UVM_WARNING` | `` `uvm_warning `` | `UVM_DISPLAY` |
| `UVM_ERROR` | `` `uvm_error `` | `UVM_DISPLAY \| UVM_COUNT` |
| `UVM_FATAL` | `` `uvm_fatal `` | `UVM_DISPLAY \| UVM_EXIT` |

Errors are printed and counted. A non-zero error count at the end means the test failed. When the count reaches the maximum quit count, the run stops; the default limit of 0 means it never stops for this reason.

**Example**

```systemverilog
function void report_phase(uvm_phase phase);
    uvm_report_server server = uvm_report_server::get_server();
    if (server.get_severity_count(UVM_ERROR) == 0)
        `uvm_info("TEST", "*** TEST PASSED ***", UVM_NONE)
    else
        `uvm_info("TEST", "*** TEST FAILED ***", UVM_NONE)
endfunction

// Give up after 10 errors
uvm_report_server::get_server().set_max_quit_count(10);
```

**See also**: `uvm_severity`, `uvm_error`, `uvm_action`, `uvm_report_server`, `uvm_report_catcher`
