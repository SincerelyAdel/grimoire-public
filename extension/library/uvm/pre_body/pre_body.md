**`pre_body`** — sequence hooks called just before and after `body()` (`pre_body`, `post_body`)

Two empty virtual tasks that `start()` calls around `body()`, but only when the sequence is a root sequence, or is started with `call_pre_post = 1`. They are meant for setup and teardown that should happen once per top-level sequence and not again for every nested sub-sequence.

**Signatures**

```systemverilog
virtual task pre_body();
virtual task post_body();
```

**Example: objections in a default sequence**

```systemverilog
class fifo_base_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_base_seq)

    task pre_body();
        if (starting_phase != null)
            starting_phase.raise_objection(this, {get_name(), " running"});
    endtask

    task post_body();
        if (starting_phase != null)
            starting_phase.drop_objection(this, {get_name(), " done"});
    endtask
endclass
```

**When they are called**

| How the sequence is started | `pre_start` / `post_start` | `pre_body` / `post_body` |
| --- | --- | --- |
| `seq.start(sqr)` | Yes | Yes |
| `seq.start(sqr, parent)` | Yes | Yes |
| `seq.start(sqr, parent, prio, 0)` | Yes | No |
| `` `uvm_do(seq) `` and the other macros | Yes | No |

**Notes**

- Because the macros skip them, do not put anything in these hooks that a sub-sequence needs to function. Use `pre_start` / `post_start` for that; they are always called.
- If the sequence is killed, `post_body` is not called. Cleanup that must always happen belongs in the code that kills the sequence.
- UVM 1.2 offers `set_automatic_phase_objection(1)` as a replacement for the objection pattern above.

**See also**: `body`, `pre_start`, `pre_do`, `starting_phase`, `uvm_sequence`, `uvm_do`
