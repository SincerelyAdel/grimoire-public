**`uvm_report_server`** — the global object that formats, counts and prints every report

All report handlers pass their messages to a single server. The server keeps the counts per severity and per ID, enforces the quit limit, composes the output line and prints the summary at the end of the test. Use it to read the error count for a PASS/FAIL message, to set the quit count, or to customise the message format.

**Getting the handle**

```systemverilog
uvm_report_server server = uvm_report_server::get_server();
```

**Main methods**

| Method | Purpose |
| --- | --- |
| `get_severity_count(uvm_severity severity)` | Number of reports at that severity |
| `get_id_count(string id)` | Number of reports with that ID |
| `set_max_quit_count(int count, bit overridable = 1)` / `get_max_quit_count()` | Stop after this many `UVM_COUNT` reports; 0 means never |
| `get_quit_count()`, `reset_quit_count()`, `reset_severity_counts()` | Counter management |
| `summarize(UVM_FILE file = 0)` (1.1) / `report_summarize(UVM_FILE file = 0)` (1.2) | Print the summary table |
| `compose_message(...)` (1.1) / `compose_report_message(...)` (1.2) | Build the output string; override to change the format |
| `static set_server(uvm_report_server server)` | Install a customised server |

**Example: PASS/FAIL banner**

```systemverilog
function void report_phase(uvm_phase phase);
    uvm_report_server server = uvm_report_server::get_server();
    int errors = server.get_severity_count(UVM_ERROR) + server.get_severity_count(UVM_FATAL);

    if (errors == 0) `uvm_info("TEST", "*** TEST PASSED ***", UVM_NONE)
    else             `uvm_error("TEST", $sformatf("*** TEST FAILED with %0d error(s) ***", errors))
endfunction
```

**Example: shorter message format (UVM 1.1)**

```systemverilog
class short_report_server extends uvm_report_server;
    virtual function string compose_message(uvm_severity severity, string name, string id,
                                            string message, string filename, int line);
        uvm_severity_type sev = uvm_severity_type'(severity);
        return $sformatf("%-11s @%0t [%s] %s", sev.name(), $time, id, message);
    endfunction
endclass

// In the test's build_phase or earlier:
short_report_server srv = new();
uvm_report_server::set_server(srv);
```

**Notes**

- The summary printed at the end ("--- UVM Report Summary ---") comes from this object.
- `+UVM_MAX_QUIT_COUNT=<n>,<overridable>` sets the quit count from the command line.
- In UVM 1.2 `uvm_report_server` is abstract and the default implementation is `uvm_default_report_server`; extend that instead.

**See also**: `uvm_report_object`, `uvm_report_catcher`, `uvm_error`, `UVM_MAX_QUIT_COUNT`, `report_phase`, `uvm_severity`
