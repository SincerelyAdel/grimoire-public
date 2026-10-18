**`uvm_sequence`** — base class for stimulus generators

A sequence is an object whose `body()` task produces a stream of sequence items, or runs other sequences. It is not a component: it is created during the run, started on a sequencer, and discarded when `body()` returns.

**Declaration**

```systemverilog
virtual class uvm_sequence #(type REQ = uvm_sequence_item,
                             type RSP = REQ) extends uvm_sequence_base;
    function new(string name = "uvm_sequence");
```

| Parameter | Meaning |
| --- | --- |
| `REQ` | The request item type. |
| `RSP` | The response item type; defaults to `REQ`. |

**Built-in members**

| Member | Purpose |
| --- | --- |
| `REQ req;` / `RSP rsp;` | Ready-made handles for the current request and response |
| `body()` | The task you implement |
| `start(sequencer, parent_sequence = null, this_priority = -1, call_pre_post = 1)` | Run the sequence on a sequencer |
| `start_item(item)` / `finish_item(item)` | Send one item to the driver |
| `get_response(output RSP response, input int transaction_id = -1)` | Wait for a response from the driver |
| `m_sequencer` / `p_sequencer` | The sequencer this sequence runs on |
| `pre_start`, `pre_body`, `post_body`, `post_start` | Hooks around `body()` |
| `starting_phase` (1.1) / `get_starting_phase()` (1.2) | The phase, when started as a default sequence |

**Example**

```systemverilog
class fifo_wr_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_wr_seq)

    rand int unsigned n_items = 16;
    constraint n_items_c { n_items inside {[1:64]}; }

    function new(string name = "fifo_wr_seq");
        super.new(name);
    endfunction

    task body();
        repeat (n_items) begin
            req = fifo_transaction::type_id::create("req");
            start_item(req);
            if (!req.randomize() with { delay < 3; })
                `uvm_error("FIFO_WR_SEQ", "randomize failed")
            finish_item(req);
        end
    endtask
endclass

// In the test's run_phase:
fifo_wr_seq seq = fifo_wr_seq::type_id::create("seq");
if (!seq.randomize() with { n_items == 32; }) `uvm_error("TEST", "randomize failed")
phase.raise_objection(this);
seq.start(env.wr_agt.sqr);
phase.drop_objection(this);
```

**Order of calls made by `start()`**

`pre_start()` → `pre_body()` (only if `call_pre_post`) → `body()` → `post_body()` (only if `call_pre_post`) → `post_start()`.

**Notes**

- `start()` blocks until `body()` returns. Use `fork` to run sequences in parallel.
- A sequence that is started by another sequence is a child; pass `this` as the parent so priorities, locks and names propagate.
- Raise objections in the test, not in the sequence, unless the sequence is the test's default sequence.
- A virtual sequence has no item type and only starts other sequences on other sequencers.

**See also**: `uvm_sequence_item`, `uvm_sequencer`, `uvm_driver`, `body`, `start_item`, `finish_item`, `uvm_do`, `uvm_sequence_base`
