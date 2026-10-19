**`uvm_severity`** — the four report severities

Each report has a severity that states how serious it is. The severity selects the default actions (print, count, exit) and is what the end-of-test summary counts.

**Declaration**

```systemverilog
typedef bit [1:0] uvm_severity;

typedef enum uvm_severity {
    UVM_INFO,
    UVM_WARNING,
    UVM_ERROR,
    UVM_FATAL
} uvm_severity_type;
```

In UVM 1.2 and IEEE 1800.2, `uvm_severity` is the enum itself and `uvm_severity_type` is deprecated.

| Severity | Macro | Default action | Effect |
| --- | --- | --- | --- |
| `UVM_INFO` | `` `uvm_info `` | `UVM_DISPLAY` | Printed if verbosity allows |
| `UVM_WARNING` | `` `uvm_warning `` | `UVM_DISPLAY` | Printed and counted in the summary |
| `UVM_ERROR` | `` `uvm_error `` | `UVM_DISPLAY \| UVM_COUNT` | Printed, counted toward the quit limit |
| `UVM_FATAL` | `` `uvm_fatal `` | `UVM_DISPLAY \| UVM_EXIT` | Printed, then the simulation ends |

**Example**

```systemverilog
function void report_phase(uvm_phase phase);
    uvm_report_server server = uvm_report_server::get_server();
    int warnings = server.get_severity_count(UVM_WARNING);
    int errors   = server.get_severity_count(UVM_ERROR);
    int fatals   = server.get_severity_count(UVM_FATAL);

    `uvm_info("TEST", $sformatf("%0d warning(s), %0d error(s), %0d fatal(s)",
                                 warnings, errors, fatals), UVM_NONE)
endfunction

// Treat every warning from the environment as an error
env.set_report_severity_override(UVM_WARNING, UVM_ERROR);

// Stop in the simulator on any error, for interactive debug
env.set_report_severity_action_hier(UVM_ERROR, UVM_DISPLAY | UVM_COUNT | UVM_STOP);
```

**See also**: `uvm_info`, `uvm_warning`, `uvm_error`, `uvm_fatal`, `uvm_action`, `uvm_verbosity`, `uvm_report_server`, `uvm_report_catcher`
