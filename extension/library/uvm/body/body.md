**`body`** — the task that defines what a sequence does

The one method every sequence must implement. It runs when the sequence is started, and the sequence is finished when it returns. Inside it you create and send sequence items, start other sequences, and use any procedural code: loops, forks, waits, constraints.

**Signature**

```systemverilog
virtual task body();
```

**Example: sending items**

```systemverilog
class fifo_wr_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_wr_seq)

    rand int unsigned n_items = 16;

    function new(string name = "fifo_wr_seq");
        super.new(name);
    endfunction

    task body();
        repeat (n_items) begin
            req = fifo_transaction::type_id::create("req");
            start_item(req);
            if (!req.randomize()) `uvm_error("FIFO_WR_SEQ", "randomize failed")
            finish_item(req);
        end
    endtask
endclass
```

**Example: composing other sequences**

```systemverilog
class fifo_fill_then_drain_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_fill_then_drain_seq)
    `uvm_declare_p_sequencer(fifo_virtual_sequencer)

    task body();
        fifo_wr_seq wr = fifo_wr_seq::type_id::create("wr");
        fifo_rd_seq rd = fifo_rd_seq::type_id::create("rd");

        if (!wr.randomize() with { n_items == 16; }) `uvm_error("SEQ", "randomize failed")
        wr.start(p_sequencer.wr_sqr, this);        // parent = this
        rd.start(p_sequencer.rd_sqr, this);
    endtask
endclass
```

**Call order around it**

`start()` calls `pre_start()`, then `pre_body()`, then `body()`, then `post_body()`, then `post_start()`. `pre_body` and `post_body` are skipped when the sequence is started with `call_pre_post = 0`, which is what the `` `uvm_do `` macros do for sub-sequences.

**Notes**

- Never call `body()` directly; call `start()`, which sets up the sequencer, the parent and the state first.
- A `body()` that returns immediately ends the sequence immediately. A `forever` loop makes a sequence that only ends when killed, which suits background or responder sequences.
- `m_sequencer` is the generic handle to the sequencer the sequence is running on; `p_sequencer` is the typed one, if declared.
- Keep signal-level timing out of `body()`. A sequence may use delays to space out stimulus, but pin wiggling belongs to the driver.

**See also**: `uvm_sequence`, `start_item`, `finish_item`, `pre_body`, `pre_start`, `uvm_do`, `m_sequencer`, `p_sequencer`
