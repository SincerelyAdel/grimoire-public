**`drop_objection`** — withdraw an objection so a phase can end

The counterpart of `raise_objection`. It decrements the phase's objection count. When the total across the whole hierarchy reaches zero, and any drain time has passed, the phase ends and every task still running in that phase is killed.

**Signature**

```systemverilog
// on uvm_phase
virtual function void drop_objection(uvm_object obj, string description = "", int count = 1);

// on uvm_objection
virtual function void drop_objection(uvm_object obj = null, string description = "", int count = 1);
```

The `obj` passed must be the same object that raised the objection.

**What happens after the last drop**

1. The drain time set for the object, if any, elapses.
2. The drop propagates to the parent, whose own drain time applies, and so on up to the top.
3. `all_dropped()` is called, and then `phase_ready_to_end()` on every component, which may raise a new objection.
4. If none is raised, the phase ends and its remaining tasks are killed.

**Typical errors**

| Symptom | Cause |
| --- | --- |
| `[OBJTN_ZERO] Object "x" attempted to drop objection count below zero` | A drop without a raise, or dropped with a different `obj` |
| Test ends immediately at time 0 | No objection was raised before time advanced |
| Test runs until the timeout | A raise with no matching drop on some path |
| Last transaction is cut off | The drop came before the DUT finished; add a drain time or use `phase_ready_to_end` |

**See also**: `raise_objection`, `set_drain_time`, `uvm_objection`, `phase_ready_to_end`, `run_phase`, `UVM_TIMEOUT`, `UVM_OBJECTION_TRACE`

---

**Coding example**

```systemverilog
task run_phase(uvm_phase phase);
    phase.raise_objection(this, "stimulus");
    fork
        wr_seq.start(env.wr_agt.sqr);
        rd_seq.start(env.rd_agt.sqr);
    join
    phase.phase_done.set_drain_time(this, 20);     // let the DUT flush
    phase.drop_objection(this, "stimulus");
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
