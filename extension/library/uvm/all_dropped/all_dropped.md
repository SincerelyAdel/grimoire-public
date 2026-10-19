**`all_dropped`** — component callbacks for objection activity (`raised`, `dropped`, `all_dropped`)

Three virtual methods on `uvm_component` that the library calls as objections are raised and dropped below a component. They let a component observe, or briefly delay, the end of a phase without owning an objection itself.

**Signatures**

```systemverilog
virtual function void raised     (uvm_objection objection, uvm_object source_obj,
                                  string description, int count);
virtual function void dropped    (uvm_objection objection, uvm_object source_obj,
                                  string description, int count);
virtual task          all_dropped(uvm_objection objection, uvm_object source_obj,
                                  string description, int count);
```

| Callback | Called when |
| --- | --- |
| `raised` | An objection is raised by this component or anything below it |
| `dropped` | An objection is dropped by this component or anything below it |
| `all_dropped` | The total for this component and everything below it has fallen to zero, and its drain time has passed |

| Argument | Meaning |
| --- | --- |
| `objection` | Which objection: compare with `phase.get_objection()` or check its name |
| `source_obj` | The object that originally raised or dropped it |
| `description` | The text given to `raise_objection` / `drop_objection` |
| `count` | How many were raised or dropped |

**Example**

```systemverilog
class fifo_env extends uvm_env;
    `uvm_component_utils(fifo_env)

    virtual function void raised(uvm_objection objection, uvm_object source_obj,
                                 string description, int count);
        `uvm_info("OBJ", $sformatf("%s raised by %s: %s", objection.get_name(),
                                    source_obj.get_full_name(), description), UVM_HIGH)
    endfunction

    // Let the scoreboard catch up before the drop continues upward
    virtual task all_dropped(uvm_objection objection, uvm_object source_obj,
                             string description, int count);
        if (objection.get_name() == "run")
            wait (scb.expected.size() == 0 || $time > 1ms);
    endtask
endclass
```

**Notes**

- `all_dropped` is a task: time spent in it delays the propagation of the drop to the parent, in the same way a drain time does.
- The callbacks fire for every objection, in every phase. Always check which one it is.
- For most end-of-test needs `phase_ready_to_end` is simpler and more direct.
- A `uvm_objection_callback` object gives the same hooks without subclassing the component.

**See also**: `raise_objection`, `drop_objection`, `uvm_objection`, `set_drain_time`, `phase_ready_to_end`, `phase_done`
