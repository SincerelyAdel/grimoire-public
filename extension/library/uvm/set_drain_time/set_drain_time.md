**`set_drain_time`** — keep a phase alive for a fixed time after the last objection is dropped

Sets a delay on an objection for a given object. When that object's objection count falls to zero, the library waits for the drain time before treating the objections as dropped. If a new objection is raised during the wait, the drop is cancelled. It gives the DUT time to finish what the last stimulus started.

**Signature**

```systemverilog
// on uvm_objection
function void set_drain_time(uvm_object obj = null, time drain);
```

| Argument | Meaning |
| --- | --- |
| `obj` | The object whose all-dropped event is delayed. `this` in a test delays the end for everything below the test. |
| `drain` | The delay, in the time unit of the calling scope when written as a literal such as `100ns` |

Getting the objection in each version:

| Version | Call |
| --- | --- |
| UVM 1.1 | `phase.phase_done.set_drain_time(this, 20ns);` |
| UVM 1.2 and later | `phase.get_objection().set_drain_time(this, 20ns);` |

**Notes**

- Set it before the final `drop_objection`; it can be set once, early in the phase, and stays in effect.
- A bare number such as `20` is in the timescale of the file where it is written. Writing the unit (`20ns`) removes the ambiguity.
- Drain times at several levels of the hierarchy add up, since each level waits before passing the drop to its parent.
- A fixed delay is a guess. When the right moment depends on data, such as "all expected items have arrived", use `phase_ready_to_end` in the checker instead.

**See also**: `phase_done`, `drop_objection`, `raise_objection`, `uvm_objection`, `phase_ready_to_end`, `shutdown_phase`

---

**Coding example**

```systemverilog
task run_phase(uvm_phase phase);
    phase.raise_objection(this);
    fork
        wr_seq.start(env.wr_agt.sqr);
        rd_seq.start(env.rd_agt.sqr);
    join
    // overflow and underflow are registered one cycle after the event,
    // so wait two clock periods before letting the phase end
    phase.phase_done.set_drain_time(this, 20);
    phase.drop_objection(this);
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
