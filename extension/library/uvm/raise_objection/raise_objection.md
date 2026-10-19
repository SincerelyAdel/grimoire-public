**`raise_objection`** — tell a phase not to end yet

Called on the phase argument inside a task phase. It increments that phase's objection count. The phase cannot end while the count is above zero, so the code between `raise_objection` and the matching `drop_objection` is guaranteed time to run.

**Signature**

```systemverilog
// on uvm_phase
virtual function void raise_objection(uvm_object obj, string description = "", int count = 1);

// on uvm_objection
virtual function void raise_objection(uvm_object obj = null, string description = "", int count = 1);
```

| Argument | Meaning |
| --- | --- |
| `obj` | Who is objecting, normally `this`. Counts are tracked per object and summed up the hierarchy. |
| `description` | Free text shown in objection traces; worth filling in |
| `count` | How many objections to raise at once |

**Example**

```systemverilog
task run_phase(uvm_phase phase);
    fifo_wr_seq seq = fifo_wr_seq::type_id::create("seq");

    phase.raise_objection(this, "fifo_wr_seq");
    seq.start(env.wr_agt.sqr);
    phase.drop_objection(this, "fifo_wr_seq");
endtask
```

From a sequence started as a default sequence:

```systemverilog
task pre_body();
    if (starting_phase != null) starting_phase.raise_objection(this, get_name());
endtask

task post_body();
    if (starting_phase != null) starting_phase.drop_objection(this, get_name());
endtask
```

**Rules**

- Raise it before any statement that consumes time. If the phase sees no objection at the end of the first delta cycle, it ends at once.
- Every raise needs exactly one drop, on every path through the code, including early exits. A missing drop hangs the test until the timeout.
- Objections apply to task phases only: `run_phase` and the run-time phases.

**Guidelines**

- Object in the test, or in the top-level sequence. Components such as drivers and monitors should not, apart from the rare case of an in-flight transaction that must complete.
- Do not raise and drop per transaction; propagating each change up the hierarchy is slow.
- Use `+UVM_OBJECTION_TRACE` to see who is objecting.

**See also**: `drop_objection`, `set_drain_time`, `uvm_objection`, `uvm_phase`, `run_phase`, `phase_ready_to_end`, `starting_phase`, `UVM_OBJECTION_TRACE`
