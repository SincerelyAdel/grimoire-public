**`uvm_report_object`** — base class that gives components their reporting interface

Parent class of `uvm_component`. It provides the `uvm_report_*` methods behind the `` `uvm_info `` family and all the per-component controls over verbosity, actions, severity overrides and log files. Each report object delegates to its own `uvm_report_handler`, which is why settings can differ between parts of the hierarchy.

**Issuing reports**

```systemverilog
virtual function void uvm_report_info   (string id, string message, int verbosity = UVM_MEDIUM,
                                         string filename = "", int line = 0);
virtual function void uvm_report_warning(string id, string message, int verbosity = UVM_MEDIUM,
                                         string filename = "", int line = 0);
virtual function void uvm_report_error  (string id, string message, int verbosity = UVM_LOW,
                                         string filename = "", int line = 0);
virtual function void uvm_report_fatal  (string id, string message, int verbosity = UVM_NONE,
                                         string filename = "", int line = 0);
function bit uvm_report_enabled(int verbosity, uvm_severity severity = UVM_INFO, string id = "");
```

**Configuring reports**

| Method | Effect |
| --- | --- |
| `set_report_verbosity_level(int level)` | Threshold for this object |
| `set_report_id_verbosity(string id, int verbosity)` | Threshold for one message ID |
| `set_report_severity_id_verbosity(severity, id, verbosity)` | Threshold for one severity and ID |
| `set_report_severity_action(severity, action)` | Actions for a severity |
| `set_report_id_action(string id, action)` | Actions for an ID |
| `set_report_severity_id_action(severity, id, action)` | Actions for one severity and ID |
| `set_report_severity_override(cur_severity, new_severity)` | Promote or demote a severity |
| `set_report_severity_id_override(cur_severity, id, new_severity)` | The same for one ID |
| `set_report_default_file(UVM_FILE file)` and the `_severity_`, `_id_` forms | Log file for `UVM_LOG` |
| `get_report_verbosity_level(severity = UVM_INFO, id = "")` | Read back the threshold |

On a component each of these also has a `_hier` form that applies to the whole subtree, for example `set_report_verbosity_level_hier(UVM_HIGH)`.

**Example**

```systemverilog
function void start_of_simulation_phase(uvm_phase phase);
    UVM_FILE log = $fopen("fifo_scb.log", "w");

    // Verbose driver, quiet everything else
    env.wr_agt.drv.set_report_verbosity_level(UVM_HIGH);

    // Send scoreboard messages to a file as well as the screen
    env.scb.set_report_default_file(log);
    env.scb.set_report_severity_action(UVM_INFO, UVM_DISPLAY | UVM_LOG);

    // Silence one noisy ID, and make one warning an error
    env.set_report_id_action_hier("FIFO_WR_MON", UVM_NO_ACTION);
    env.set_report_severity_id_override(UVM_WARNING, "FIFO_ENV", UVM_ERROR);
endfunction
```

**Notes**

- Settings made in `build_phase` on a parent do not reach children that do not exist yet. Apply hierarchical settings in `end_of_elaboration_phase` or later.
- The same controls exist as plusargs: `+uvm_set_verbosity`, `+uvm_set_action`, `+uvm_set_severity`.
- User hooks `report_info_hook`, `report_error_hook`, `report_warning_hook`, `report_fatal_hook` and `report_hook` are called when the action includes `UVM_CALL_HOOK`.

**See also**: `uvm_info`, `uvm_report_info`, `set_report_verbosity_level`, `uvm_action`, `uvm_verbosity`, `uvm_severity`, `uvm_report_server`, `uvm_report_catcher`
