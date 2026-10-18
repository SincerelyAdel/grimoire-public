**`global_stop_request`** — legacy call that ends the run phase

An OVM-era global function that asks the run phase to stop. It is deprecated in UVM 1.1, where it only works if the library is compiled without `UVM_NO_DEPRECATED`, and is removed from UVM 1.2 and IEEE 1800.2. The replacement is the phase objection mechanism.

**Old style**

```systemverilog
task run_phase(uvm_phase phase);
    seq.start(env.wr_agt.sqr);
    global_stop_request();          // or: uvm_top.stop_request();
endtask
```

**Current style**

```systemverilog
task run_phase(uvm_phase phase);
    phase.raise_objection(this);
    seq.start(env.wr_agt.sqr);
    phase.drop_objection(this);
endtask
```

**Why it was replaced**

- It ends the phase regardless of what other components are doing, so a scoreboard or a second sequence can be cut off mid-transaction.
- Any component can call it, which makes the end of test hard to trace.
- Objections make ending cooperative: the phase ends only when everyone who objected has agreed.

**Related legacy features**

| Legacy | Replacement |
| --- | --- |
| `global_stop_request()`, `uvm_top.stop_request()` | Drop the phase objection |
| `uvm_test_done` objection | `phase.raise_objection()` / `phase.drop_objection()` |
| `set_global_timeout(t)` | `uvm_top.set_timeout(t)` |
| `set_global_stop_timeout(t)` | A drain time, or `phase_ready_to_end` |
| The `stop()` task and `enable_stop_interrupt` | `phase_ready_to_end` |

**Notes**

- In UVM 1.1, a stop request does not end the phase while objections are still raised, which is a common source of confusion in half-converted testbenches.
- When porting, convert every component at once; mixing the two schemes gives end-of-test behaviour that is hard to predict.

**See also**: `raise_objection`, `drop_objection`, `uvm_test_done`, `set_timeout`, `phase_ready_to_end`
