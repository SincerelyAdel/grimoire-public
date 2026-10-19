**`pre_start`** — sequence hooks called at the very beginning and end of `start()` (`pre_start`, `post_start`)

Two empty virtual tasks that are always called, for every sequence, however it is started: by an explicit `start()`, by a `` `uvm_do `` macro, or as a default sequence. Use them for setup and cleanup that a sequence always needs.

**Signatures**

```systemverilog
virtual task pre_start();
virtual task post_start();
```

**Order inside `start()`**

1. `pre_start()`
2. `pre_body()`, if `call_pre_post` is 1
3. `parent_sequence.pre_do(0)` and `mid_do(this)`, if there is a parent
4. `body()`
5. `parent_sequence.post_do(this)`, if there is a parent
6. `post_body()`, if `call_pre_post` is 1
7. `post_start()`

**Example**

```systemverilog
class fifo_base_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_base_seq)

    fifo_cfg cfg;

    task pre_start();
        if (!uvm_config_db #(fifo_cfg)::get(m_sequencer, "", "cfg", cfg))
            `uvm_fatal("FIFO_SEQ", "no cfg available on the sequencer")
        `uvm_info("FIFO_SEQ", {"starting ", get_sequence_path()}, UVM_MEDIUM)
    endtask

    task post_start();
        `uvm_info("FIFO_SEQ", {"finished ", get_sequence_path()}, UVM_MEDIUM)
    endtask
endclass
```

**Notes**

- `m_sequencer` is already set when `pre_start` runs, so it can be used to fetch configuration, as above.
- A sequence that is killed does not reach `post_start`; cleanup that must always happen belongs in the code that kills it.
- These hooks were added in UVM 1.1 to complement `pre_body` / `post_body`, which the macros skip.

**See also**: `pre_body`, `body`, `pre_do`, `uvm_sequence`, `m_sequencer`
