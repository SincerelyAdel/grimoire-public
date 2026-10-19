**`uvm_phase`** — the object that represents one phase of the simulation and is passed to every phase method

UVM runs a testbench as an ordered series of phases. Each phase is a `uvm_phase` object, and the library passes that object to the matching method on every component: `build_phase(uvm_phase phase)`, `run_phase(uvm_phase phase)` and so on. Inside a phase method the argument is mainly used to raise and drop objections, which is how a task phase is kept alive.

**The phases**

| Group | Phases, in order | Kind |
| --- | --- | --- |
| Build | `build` (top-down), `connect`, `end_of_elaboration`, `start_of_simulation` | Functions, zero time |
| Run | `run` | Task |
| Run-time, parallel to `run` | `pre_reset`, `reset`, `post_reset`, `pre_configure`, `configure`, `post_configure`, `pre_main`, `main`, `post_main`, `pre_shutdown`, `shutdown`, `post_shutdown` | Tasks |
| Cleanup | `extract`, `check`, `report`, `final` (top-down) | Functions |

All function phases other than `build` and `final` run bottom-up.

**Main methods**

| Method | Purpose |
| --- | --- |
| `raise_objection(uvm_object obj, string description = "", int count = 1)` | Keep the phase from ending |
| `drop_objection(uvm_object obj, string description = "", int count = 1)` | Allow it to end once all are dropped |
| `phase_done` (1.1) / `get_objection()` (1.2) | The `uvm_objection` of this phase, for `set_drain_time` |
| `get_name()` | Phase name, such as `"run"` or `"main"` |
| `get_state()` | `UVM_PHASE_DORMANT`, `UVM_PHASE_EXECUTING`, `UVM_PHASE_ENDED`, ... |
| `wait_for_state(state, op = UVM_EQ)` | Block until the phase reaches a state |
| `is(phase)`, `is_before(phase)`, `is_after(phase)` | Compare against another phase |
| `jump(uvm_phase phase)` | Jump to another phase in the schedule, for example back to reset |
| `get_run_count()` | How many times this phase has executed |

**How a task phase ends**

A task phase ends when its objection count reaches zero after having been raised at least once, or immediately at time 0 if nobody ever raises one. When it ends, every still-running phase task is killed, including `forever` loops in drivers and monitors.

**Notes**

- Function phases cannot consume time, so objections are meaningless in them.
- The predefined phase objects are singletons: `uvm_build_phase::get()`, `uvm_run_phase::get()`, `uvm_main_phase::get()` and so on.
- A phase jump kills running phase tasks; components must be written to restart cleanly.
- Mixing `run_phase` and the run-time phases across components is legal but makes the end of test harder to reason about. Many teams use `run_phase` only in drivers and monitors, and either style consistently in tests.

**See also**: `build_phase`, `run_phase`, `raise_objection`, `drop_objection`, `phase_done`, `uvm_objection`, `uvm_domain`, `uvm_phase_state`

---

**Coding example**

```systemverilog
task run_phase(uvm_phase phase);
    fifo_wr_seq seq = fifo_wr_seq::type_id::create("seq");

    phase.raise_objection(this, "running fifo_wr_seq");
    seq.start(env.wr_agt.sqr);
    phase.phase_done.set_drain_time(this, 20ns);
    phase.drop_objection(this, "fifo_wr_seq done");
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
