**`m_sequencer`** — a sequence's generic handle to the sequencer it is running on

A protected member of every sequence and sequence item, of type `uvm_sequencer_base`. It is set by `start()` (and by `start_item()` for items) and is the sequencer used when the sequence sends its items. Because its type is the base class, it gives access only to what every sequencer has.

**Declaration** (in `uvm_sequence_item`)

```systemverilog
protected uvm_sequencer_base m_sequencer;
function uvm_sequencer_base get_sequencer();
```

**What it is good for**

```systemverilog
task body();
    fifo_cfg cfg;

    // As the context for the configuration database: looks up the sequencer's scope
    if (!uvm_config_db #(fifo_cfg)::get(m_sequencer, "", "cfg", cfg))
        `uvm_fatal("FIFO_SEQ", "no cfg set for the sequencer")

    // As the context for reports, so they follow the sequencer's verbosity
    `uvm_info_context("FIFO_SEQ", "starting", UVM_MEDIUM, m_sequencer)

    // Starting a child sequence on the same sequencer
    child_seq.start(m_sequencer, this);

    // Hierarchy information
    `uvm_info("FIFO_SEQ", {"running on ", m_sequencer.get_full_name()}, UVM_HIGH)
endtask
```

**`m_sequencer` or `p_sequencer`**

| | `m_sequencer` | `p_sequencer` |
| --- | --- | --- |
| Type | `uvm_sequencer_base` | The type given to `` `uvm_declare_p_sequencer `` |
| Exists | Always | Only if the macro is used |
| Can reach | Base-class methods | Your sequencer's own fields and methods |
| Effect on reuse | None | Ties the sequence to that sequencer type |

**Notes**

- It is null until the sequence is started, so it cannot be used in the constructor.
- To reach a user-defined member of the sequencer without the macro, cast it: `if (!$cast(my_sqr, m_sequencer)) ...`.
- The `m_` prefix marks it as an internal member; from outside the sequence, use `get_sequencer()`.

**See also**: `p_sequencer`, `uvm_declare_p_sequencer`, `uvm_sequencer`, `uvm_sequence`, `body`
