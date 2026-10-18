**`uvm_action`** — what happens when a report is issued (`UVM_DISPLAY`, `UVM_COUNT`, `UVM_EXIT`, ...)

Each report triggers a set of actions, chosen by its severity and optionally by its ID. Actions are bit flags that can be OR-ed together. Changing them is how you silence a message, log it to a file, make it count as a failure, or stop the simulator on it.

**Declaration**

```systemverilog
typedef int uvm_action;

typedef enum {
    UVM_NO_ACTION = 'b000000,
    UVM_DISPLAY   = 'b000001,
    UVM_LOG       = 'b000010,
    UVM_COUNT     = 'b000100,
    UVM_EXIT      = 'b001000,
    UVM_CALL_HOOK = 'b010000,
    UVM_STOP      = 'b100000
} uvm_action_type;
```

UVM 1.2 adds `UVM_RM_RECORD = 'b1000000`, which sends the message to the transaction recorder.

| Action | Effect |
| --- | --- |
| `UVM_NO_ACTION` | Nothing: the report is dropped |
| `UVM_DISPLAY` | Print to standard output |
| `UVM_LOG` | Write to the file set with `set_report_default_file` or its variants |
| `UVM_COUNT` | Add to the quit count; the run ends when it reaches the maximum |
| `UVM_EXIT` | End the simulation now, through `die()` |
| `UVM_CALL_HOOK` | Call the `report_*_hook` methods of the component |
| `UVM_STOP` | Call `$stop`, pausing in the simulator's debugger |

**Defaults by severity**

| Severity | Actions |
| --- | --- |
| `UVM_INFO` | `UVM_DISPLAY` |
| `UVM_WARNING` | `UVM_DISPLAY` |
| `UVM_ERROR` | `UVM_DISPLAY \| UVM_COUNT` |
| `UVM_FATAL` | `UVM_DISPLAY \| UVM_EXIT` |

**Example**

```systemverilog
function void start_of_simulation_phase(uvm_phase phase);
    UVM_FILE log = $fopen("fifo.log", "w");

    // Silence one ID everywhere in the environment
    env.set_report_id_action_hier("FIFO_WR_MON", UVM_NO_ACTION);

    // Warnings from the scoreboard count toward the quit limit
    env.scb.set_report_severity_action(UVM_WARNING, UVM_DISPLAY | UVM_COUNT);

    // Errors go to a file as well as the screen
    env.set_report_default_file_hier(log);
    env.set_report_severity_action_hier(UVM_ERROR, UVM_DISPLAY | UVM_LOG | UVM_COUNT);

    // Break into the debugger at the first scoreboard error
    env.scb.set_report_severity_id_action(UVM_ERROR, "FIFO_SCB", UVM_DISPLAY | UVM_COUNT | UVM_STOP);
endfunction
```

Command-line form:

```
+uvm_set_action=uvm_test_top.env.*,FIFO_WR_MON,_ALL_,UVM_NO_ACTION
```

**Notes**

- The most specific setting wins: severity-and-ID, then ID, then severity.
- Setting an action replaces the whole set; include `UVM_DISPLAY` again if you still want the message printed.
- Removing `UVM_COUNT` from errors hides failures from the quit limit, although the severity count in the summary still includes them.

**See also**: `uvm_severity`, `uvm_report_object`, `uvm_report_catcher`, `uvm_set_verbosity`, `UVM_MAX_QUIT_COUNT`
