**`+UVM_MAX_QUIT_COUNT`** — command-line option that stops the run after a number of errors

Sets the maximum quit count of the report server. Each report whose action includes `UVM_COUNT`, by default every `UVM_ERROR`, adds one to the quit count. When the count reaches the maximum, the simulation ends.

**Syntax**

```
+UVM_MAX_QUIT_COUNT=<count>,<overridable>
```

| Field | Meaning |
| --- | --- |
| `count` | Number of counted reports after which to stop. 0, the default, means never stop. |
| `overridable` | `YES` or `NO`: whether a later `set_max_quit_count()` call may change it |

**Example**

```
xrun -R +UVM_TESTNAME=fifo_test +UVM_MAX_QUIT_COUNT=5,NO
```

In code:

```systemverilog
uvm_report_server::get_server().set_max_quit_count(5);
```

When the limit is reached, the summary shows:

```
Quit count reached!
Quit count :     5 of     5
```

**Notes**

- A small limit saves regression time and disk space when a test fails early and would otherwise print the same error thousands of times.
- A limit of 1 stops at the first error, which is convenient for debugging.
- Only reports with the `UVM_COUNT` action count. Add it to warnings with `set_report_severity_action(UVM_WARNING, UVM_DISPLAY | UVM_COUNT)` if they should count too.
- The remaining phases, including `report_phase`, do not run when the run ends this way; the report summary is still printed.

**See also**: `uvm_error`, `uvm_report_server`, `uvm_action`, `UVM_ERROR`, `UVM_TIMEOUT`
