**`uvm_report_catcher`** — a callback that intercepts reports before they are printed

A catcher sees every report issued by the objects it is attached to and can let it through, change its severity, ID, text, verbosity or actions, or swallow it. It is the standard way to demote an expected error in a negative test, or to promote a warning in a strict regression, without editing the code that issues it.

**Declaration**

```systemverilog
virtual class uvm_report_catcher extends uvm_callback;
    typedef enum { UNKNOWN_ACTION, THROW, CAUGHT } action_e;
    function new(string name = "uvm_report_catcher");
    pure virtual function action_e catch();
```

**Inside `catch()`**

| Method | Purpose |
| --- | --- |
| `get_severity()`, `get_id()`, `get_message()`, `get_verbosity()`, `get_action()` | Inspect the report |
| `get_client()` | The report object that issued it |
| `get_fname()`, `get_line()` | Source location |
| `set_severity(sev)`, `set_id(id)`, `set_message(msg)`, `set_verbosity(v)`, `set_action(a)` | Modify it |
| `return THROW;` | Pass it on, with any modifications, to the next catcher and the server |
| `return CAUGHT;` | Stop it; nothing is printed or counted |

**Example**

```systemverilog
class overflow_demoter extends uvm_report_catcher;
    int unsigned seen;

    function new(string name = "overflow_demoter");
        super.new(name);
    endfunction

    virtual function action_e catch();
        if (get_severity() == UVM_ERROR && get_id() == "FIFO_SCB" &&
            uvm_is_match("*overflow*", get_message())) begin
            seen++;
            set_severity(UVM_INFO);
            set_action(UVM_DISPLAY);          // drop UVM_COUNT so it is not counted
        end
        return THROW;
    endfunction
endclass

class fifo_overflow_test extends fifo_test;
    overflow_demoter demoter;

    function void start_of_simulation_phase(uvm_phase phase);
        demoter = new("demoter");
        uvm_report_cb::add(null, demoter);            // null: every report object
        // uvm_report_cb::add(env.scb, demoter);      // or just one component
    endfunction

    function void check_phase(uvm_phase phase);
        if (demoter.seen == 0) `uvm_error("TEST", "expected overflow was never reported")
    endfunction
endclass
```

**Notes**

- Catchers run in the order they were added; `uvm_report_cb::add(obj, catcher, UVM_PREPEND)` puts one first.
- Changing severity does not change the action by itself. An error demoted to info still carries `UVM_COUNT` unless you also set the action.
- Always verify that the expected message actually occurred, as above, or a demoted error hides a test that silently stopped exercising the scenario.
- `uvm_report_catcher::print_catcher()` lists installed catchers; `summarize_report_catcher()` prints how many reports were caught.

**See also**: `uvm_report_object`, `uvm_report_server`, `uvm_callbacks`, `uvm_error`, `uvm_action`, `uvm_severity`
