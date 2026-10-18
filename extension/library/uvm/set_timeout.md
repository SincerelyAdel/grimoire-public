**`set_timeout`** — set the global watchdog that ends a hung test

A method of `uvm_root`, called on `uvm_top`. If the run phase and run-time phases have not finished when the timeout is reached, the library reports a fatal error and ends the simulation. It guards against tests that never finish because an objection is not dropped or a wait never completes.

**Signature**

```systemverilog
function void set_timeout(time timeout, bit overridable = 1);
```

| Argument | Meaning |
| --- | --- |
| `timeout` | Absolute simulation time at which to give up |
| `overridable` | 1: a later `set_timeout` call may change it. 0: this value is final. |

**Example**

```systemverilog
class fifo_base_test extends uvm_test;
    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        uvm_top.set_timeout(5ms);                   // default for every test
    endfunction
endclass

class fifo_long_test extends fifo_base_test;
    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        uvm_top.set_timeout(200ms);                 // this one legitimately runs longer
    endfunction
endclass
```

On expiry:

```
UVM_FATAL @ 5000000: reporter [PH_TIMEOUT] Explicit timeout of 5000000 hit, indicating a probable testbench issue
```

**Notes**

- The default is 9200 s of simulated time, which is effectively no protection. Set a value suited to the test.
- `+UVM_TIMEOUT=<time>,<YES|NO>` sets it from the command line; with `NO`, calls in the code cannot override it.
- Write the value with a unit (`5ms`). A bare number is interpreted in the time unit of the scope where it is written.
- The timeout says only that the test hung. To find out why, use `+UVM_OBJECTION_TRACE` or `display_objections()`.
- For detecting a stall long before the global limit, see `uvm_heartbeat`.

**See also**: `UVM_TIMEOUT`, `uvm_root`, `uvm_top`, `uvm_objection`, `UVM_OBJECTION_TRACE`, `uvm_heartbeat`
