**`+UVM_TIMEOUT`** — command-line option that sets the global simulation timeout

Sets the watchdog that ends the run with a fatal error if the run phase has not finished by the given time. It catches tests that hang because an objection is never dropped or a sequence waits forever.

**Syntax**

```
+UVM_TIMEOUT=<timeout>,<overridable>
```

| Field | Meaning |
| --- | --- |
| `timeout` | Time, in the timescale units of the UVM package |
| `overridable` | `YES` or `NO`: whether a later `set_timeout()` call in the testbench may change it |

**Example**

```
xrun -R +UVM_TESTNAME=fifo_test +UVM_TIMEOUT=2000000,NO
```

In code:

```systemverilog
function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    uvm_top.set_timeout(2ms, 1);       // overridable from the command line
endfunction
```

When it expires:

```
UVM_FATAL @ 2000000: reporter [PH_TIMEOUT] Explicit timeout of 2000000 hit, indicating a probable testbench issue
```

**Notes**

- The default timeout is 9200 seconds of simulated time (`` `UVM_DEFAULT_TIMEOUT ``), which is effectively never for most designs. Set a realistic value per test.
- With `NO`, the command-line value wins over any `set_timeout()` in the testbench; this is useful for forcing a short limit in regressions.
- To find out why a test hangs, combine it with `+UVM_OBJECTION_TRACE` or call `display_objections()` on the phase objection.

**See also**: `set_timeout`, `uvm_root`, `UVM_OBJECTION_TRACE`, `uvm_objection`, `uvm_heartbeat`
