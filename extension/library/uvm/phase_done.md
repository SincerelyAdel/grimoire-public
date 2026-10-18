**`phase_done`** — the objection object that belongs to a phase

A member of `uvm_phase`, of type `uvm_objection`. Each task phase has one, and it is the object that `phase.raise_objection()` and `phase.drop_objection()` operate on. You reach for it directly when you need an objection feature that the phase does not forward, most often `set_drain_time`.

**Declaration** (in `uvm_phase`)

```systemverilog
uvm_objection phase_done;
function uvm_objection get_objection();     // returns phase_done
```

**Example**

```systemverilog
task run_phase(uvm_phase phase);
    phase.raise_objection(this);
    seq.start(env.wr_agt.sqr);

    phase.phase_done.set_drain_time(this, 20);
    phase.drop_objection(this);
endtask

// Debugging: who is still objecting?
function void phase_ready_to_end(uvm_phase phase);
    if (phase.get_name() == "run") begin
        uvm_object objectors[$];
        phase.phase_done.get_objectors(objectors);
        foreach (objectors[i])
            `uvm_info("OBJ", {"still objecting: ", objectors[i].get_full_name()}, UVM_LOW)
        phase.phase_done.display_objections();
    end
endfunction
```

**Useful methods on it**

| Method | Purpose |
| --- | --- |
| `set_drain_time(obj, drain)` | Delay the end of the phase |
| `get_objection_total(obj = null)` | Outstanding objections at and below `obj` |
| `get_objection_count(obj = null)` | Outstanding objections raised by `obj` itself |
| `get_objectors(ref list[$])` | The objects currently objecting |
| `display_objections(obj = null, show_header = 1)` | Print the objection tree |
| `trace_mode(1)` | Log every raise and drop for this phase |

**Notes**

- In UVM 1.2 the variable is no longer part of the documented interface; use `phase.get_objection()`, which exists in the Cadence 1.1d library as well.
- It is null for function phases, which have no objection.

**See also**: `set_drain_time`, `uvm_objection`, `raise_objection`, `drop_objection`, `uvm_phase`
