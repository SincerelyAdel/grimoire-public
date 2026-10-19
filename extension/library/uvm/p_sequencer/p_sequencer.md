**`p_sequencer`** — a sequence's typed handle to its sequencer

A variable created by the `` `uvm_declare_p_sequencer `` macro. It points to the same sequencer as `m_sequencer`, but has the specific sequencer class as its type, so the sequence can use members that only that class has. It is the standard way for a virtual sequence to reach the real sequencers.

**How it comes to exist**

```systemverilog
class fifo_virtual_seq extends uvm_sequence;
    `uvm_object_utils(fifo_virtual_seq)
    `uvm_declare_p_sequencer(fifo_virtual_sequencer)     // declares: fifo_virtual_sequencer p_sequencer;
    ...
endclass
```

When the sequence starts, the generated code casts `m_sequencer` to that type and assigns `p_sequencer`. If the cast fails, UVM reports a fatal error.

**Example**

```systemverilog
class fifo_virtual_sequencer extends uvm_sequencer;
    `uvm_component_utils(fifo_virtual_sequencer)
    fifo_sequencer wr_sqr;
    fifo_sequencer rd_sqr;
    fifo_cfg       cfg;
    function new(string name, uvm_component parent);
        super.new(name, parent);
    endfunction
endclass

class fifo_virtual_seq extends uvm_sequence;
    `uvm_object_utils(fifo_virtual_seq)
    `uvm_declare_p_sequencer(fifo_virtual_sequencer)

    task body();
        fifo_wr_seq wr = fifo_wr_seq::type_id::create("wr");
        fifo_rd_seq rd = fifo_rd_seq::type_id::create("rd");

        wr.n_items = p_sequencer.cfg.depth;
        fork
            wr.start(p_sequencer.wr_sqr, this);
            rd.start(p_sequencer.rd_sqr, this);
        join
    endtask
endclass

// Environment connect_phase
vsqr.wr_sqr = wr_agt.sqr;
vsqr.rd_sqr = rd_agt.sqr;

// Test
vseq.start(env.vsqr);
```

**Notes**

- It is null until the sequence has been started. Use it in `body()`, `pre_start()` and later, never in the constructor.
- Starting the sequence on any other sequencer type fails at run time, not at compile time.
- Sequences that only send items do not need it; avoiding it keeps them reusable on any sequencer of the right item type.

**See also**: `m_sequencer`, `uvm_declare_p_sequencer`, `uvm_sequencer`, `uvm_sequence`, `body`
