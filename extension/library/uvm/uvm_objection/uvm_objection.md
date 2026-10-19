**`uvm_objection`** — a hierarchical counter that keeps a phase, or the test, alive

An objection is a count of reasons not to finish yet. Each `raise` adds to the count and each `drop` subtracts. When the total returns to zero, and an optional drain time has passed, the phase that owns the objection ends. Every task phase has its own objection, reached through `phase.raise_objection()` and `phase.drop_objection()`.

**Declaration**

```systemverilog
class uvm_objection extends uvm_report_object;
    function new(string name = "");
```

**Main methods**

| Method | Purpose |
| --- | --- |
| `raise_objection(uvm_object obj = null, string description = "", int count = 1)` | Add to the count |
| `drop_objection(uvm_object obj = null, string description = "", int count = 1)` | Subtract from the count |
| `set_drain_time(uvm_object obj = null, time drain)` | Wait this long after the count for `obj` reaches zero before propagating the drop |
| `get_objection_count(uvm_object obj = null)` | Objections raised directly by `obj` |
| `get_objection_total(uvm_object obj = null)` | Objections raised by `obj` and everything below it |
| `get_objectors(ref uvm_object list[$])` | Who currently objects |
| `display_objections(uvm_object obj = null, bit show_header = 1)` | Print the tree of outstanding objections |
| `wait_for(uvm_objection_event objt_event, uvm_object obj = null)` | Block until `UVM_RAISED`, `UVM_DROPPED` or `UVM_ALL_DROPPED` |
| `trace_mode(int mode = -1)` | Turn tracing on or off |

**Callbacks on components**

`raised()`, `dropped()` and `all_dropped()` are virtual methods on `uvm_component` and `uvm_objection` that are called as counts propagate up the hierarchy.

**Notes**

- Add `+UVM_OBJECTION_TRACE` to the command line to log every raise and drop.
- Raising and dropping is relatively expensive. Do it once around a whole sequence, not once per transaction.
- A drop without a matching raise is an error: "Object ... attempted to drop objection count below zero".
- If nothing ever raises an objection in a task phase, the phase ends at time 0.

**See also**: `raise_objection`, `drop_objection`, `set_drain_time`, `phase_done`, `uvm_phase`, `uvm_test_done`, `UVM_OBJECTION_TRACE`

---

**Coding example**

```systemverilog
task run_phase(uvm_phase phase);
    uvm_objection objection = phase.get_objection();   // phase.phase_done in UVM 1.1

    phase.raise_objection(this, "main stimulus");
    seq.start(env.wr_agt.sqr);
    objection.set_drain_time(this, 100ns);
    phase.drop_objection(this, "main stimulus done");
endtask

// Debugging a test that never ends:
function void phase_ready_to_end(uvm_phase phase);
    if (phase.get_name() == "run")
        phase.get_objection().display_objections();
endfunction
```

---

**Visual**

<img src="behavior.svg" width="300">
