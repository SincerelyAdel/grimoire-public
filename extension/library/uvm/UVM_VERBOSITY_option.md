**`+UVM_VERBOSITY`** — command-line option that sets the global verbosity threshold

Sets the initial verbosity threshold of every component. An `` `uvm_info `` message is printed only if its verbosity is at or below the threshold, so this one option turns the amount of log output up or down for a whole run.

**Syntax**

```
+UVM_VERBOSITY=<UVM_NONE | UVM_LOW | UVM_MEDIUM | UVM_HIGH | UVM_FULL | UVM_DEBUG>
```

A plain integer is also accepted, for example `+UVM_VERBOSITY=250`. The default is `UVM_MEDIUM`.

**Example**

```
xrun -R +UVM_TESTNAME=fifo_test +UVM_VERBOSITY=UVM_HIGH       # debugging
xrun -R +UVM_TESTNAME=fifo_test +UVM_VERBOSITY=UVM_LOW        # regression
```

| Setting | What is printed |
| --- | --- |
| `UVM_NONE` | Only `UVM_NONE` infos, plus all warnings, errors and fatals |
| `UVM_LOW` | Adds milestones |
| `UVM_MEDIUM` | Adds normal progress messages |
| `UVM_HIGH` | Adds per-transaction detail |
| `UVM_FULL`, `UVM_DEBUG` | Adds internal and library-level detail |

**Finer control**

```
+uvm_set_verbosity=<component>,<id>,<verbosity>,<phase>
+uvm_set_verbosity=<component>,<id>,<verbosity>,time,<time>

+uvm_set_verbosity=uvm_test_top.env.wr_agt.*,_ALL_,UVM_FULL,run
+uvm_set_verbosity=uvm_test_top.env.scb,FIFO_SCB,UVM_HIGH,time,1000
```

**Notes**

- It is applied when the components are created, so it also covers messages printed during `build_phase`.
- A later `set_report_verbosity_level()` call in the code overrides it for that component.
- An unrecognised value falls back to the default with a warning, so check the spelling if the log looks unchanged.
- Verbosity does not affect warnings, errors or fatals.

**See also**: `uvm_verbosity`, `uvm_info`, `uvm_set_verbosity`, `set_report_verbosity_level`, `UVM_TESTNAME`
