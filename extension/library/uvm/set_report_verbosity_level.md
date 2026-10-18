**`set_report_verbosity_level`** — reporting controls on a component (`set_report_*`)

A family of `uvm_report_object` methods that change how one component, or a whole subtree, handles reports: the verbosity threshold, the actions taken, severity overrides and log files. They are the in-code equivalents of the `+UVM_VERBOSITY` and `+uvm_set_*` command-line options.

**Verbosity**

```systemverilog
function void set_report_verbosity_level       (int verbosity_level);
function void set_report_id_verbosity          (string id, int verbosity);
function void set_report_severity_id_verbosity (uvm_severity severity, string id, int verbosity);
function int  get_report_verbosity_level       (uvm_severity severity = UVM_INFO, string id = "");
```

**Actions**

```systemverilog
function void set_report_severity_action    (uvm_severity severity, uvm_action action);
function void set_report_id_action          (string id, uvm_action action);
function void set_report_severity_id_action (uvm_severity severity, string id, uvm_action action);
```

**Severity overrides**

```systemverilog
function void set_report_severity_override    (uvm_severity cur_severity, uvm_severity new_severity);
function void set_report_severity_id_override (uvm_severity cur_severity, string id, uvm_severity new_severity);
```

**Log files**

```systemverilog
function void set_report_default_file     (UVM_FILE file);
function void set_report_severity_file    (uvm_severity severity, UVM_FILE file);
function void set_report_id_file          (string id, UVM_FILE file);
function void set_report_severity_id_file (uvm_severity severity, string id, UVM_FILE file);
```

**Hierarchical forms**

On a `uvm_component`, most of these have a `_hier` variant that applies to the component and everything below it:

`set_report_verbosity_level_hier`, `set_report_id_verbosity_hier`, `set_report_severity_id_verbosity_hier`, `set_report_severity_action_hier`, `set_report_id_action_hier`, `set_report_severity_id_action_hier`, `set_report_default_file_hier`, `set_report_severity_file_hier`, `set_report_id_file_hier`, `set_report_severity_id_file_hier`.

**Example**

```systemverilog
function void end_of_elaboration_phase(uvm_phase phase);
    UVM_FILE log = $fopen("scb.log", "w");

    // Quiet environment, one talkative driver
    env.set_report_verbosity_level_hier(UVM_LOW);
    env.wr_agt.drv.set_report_verbosity_level(UVM_HIGH);

    // One message ID in full detail, wherever it is issued in the scoreboard
    env.scb.set_report_id_verbosity("FIFO_SCB", UVM_FULL);

    // Silence a noisy ID across the whole environment
    env.set_report_id_action_hier("FIFO_WR_MON", UVM_NO_ACTION);

    // Scoreboard reports to a file as well
    env.scb.set_report_default_file(log);
    env.scb.set_report_severity_action(UVM_INFO,  UVM_DISPLAY | UVM_LOG);
    env.scb.set_report_severity_action(UVM_ERROR, UVM_DISPLAY | UVM_LOG | UVM_COUNT);

    // Warnings from the monitors are errors in this test
    env.wr_agt.mon.set_report_severity_override(UVM_WARNING, UVM_ERROR);
endfunction
```

**Precedence**

The most specific setting wins: severity and ID together, then ID alone, then severity alone, then the component's general level.

**Notes**

- The `_hier` forms only reach components that exist when they are called. Use them from `end_of_elaboration_phase` onward, not in the parent's `build_phase`.
- A `set_report_*_action` call replaces the whole action set; include `UVM_DISPLAY` if the message should still be printed.
- `UVM_LOG` writes nothing unless a file has been set.
- Verbosity affects only `UVM_INFO` messages issued through the macros.

**See also**: `uvm_report_object`, `uvm_verbosity`, `uvm_action`, `uvm_severity`, `UVM_VERBOSITY`, `uvm_set_verbosity`, `uvm_report_catcher`
