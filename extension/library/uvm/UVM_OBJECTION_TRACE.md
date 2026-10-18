**`+UVM_OBJECTION_TRACE`** — tracing options for objections, phases, configuration and resources (`+UVM_*_TRACE`)

A family of command-line switches that make the library log its own internal activity. They take no value and need no change to the testbench, and they are the first thing to try when a test ends too early, never ends, or a configuration value does not arrive.

| Option | What it logs |
| --- | --- |
| `+UVM_OBJECTION_TRACE` | Every objection raise and drop, with the object, the description and the new counts |
| `+UVM_PHASE_TRACE` | Every phase state change in every domain |
| `+UVM_CONFIG_DB_TRACE` | Every `uvm_config_db` `set` and `get`, with scope, name, type and whether it succeeded |
| `+UVM_RESOURCE_DB_TRACE` | Every `uvm_resource_db` access |

**Example: a test that never finishes**

```
xrun -R +UVM_TESTNAME=fifo_test +UVM_OBJECTION_TRACE
```

```
UVM_INFO @ 0: run [OBJTN_TRC] Object uvm_test_top raised 1 objection(s) (running fifo_wr_seq): count=1  total=1
UVM_INFO @ 0: run [OBJTN_TRC] Object uvm_test_top.env.scb raised 1 objection(s): count=1  total=1
UVM_INFO @ 5210: run [OBJTN_TRC] Object uvm_test_top dropped 1 objection(s) (fifo_wr_seq done): count=0  total=0
```

Here the scoreboard raised an objection and never dropped it.

**Example: a configuration value that is not found**

```
xrun -R +UVM_TESTNAME=fifo_test +UVM_CONFIG_DB_TRACE
```

```
UVM_INFO ... [CFGDB/SET] Configuration 'uvm_test_top.env.wr_agt.drv.vif' (type virtual interface fifo_if) set by = (virtual interface fifo_if) ...
UVM_INFO ... [CFGDB/GET] Configuration 'uvm_test_top.env.wr_agt.drv.vif' (type virtual interface fifo_if.wr_driver) read by uvm_test_top.env.wr_agt.drv = null (failed lookup)
```

The `set` used type `virtual fifo_if` and the `get` used `virtual fifo_if.wr_driver`. The types differ, so the lookup fails.

**Notes**

- The output is large. Redirect the log to a file and search for the IDs `OBJTN_TRC`, `PH/TRC`, `CFGDB/SET`, `CFGDB/GET`.
- Giving objections a description (the second argument of `raise_objection`) makes the trace far easier to read.
- The same tracing can be enabled from code: `uvm_objection::trace_mode(1)` on an objection, `uvm_config_db_options::turn_on_tracing()`, `uvm_resource_db_options::turn_on_tracing()`.

**See also**: `uvm_objection`, `raise_objection`, `uvm_config_db`, `uvm_resource_db`, `uvm_phase`, `UVM_TIMEOUT`
