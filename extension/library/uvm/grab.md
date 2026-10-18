**`grab`** — take exclusive control of a sequencer (`grab`, `ungrab`, `lock`, `unlock`)

Called by a sequence to stop every other sequence on the same sequencer from sending items until it releases control. Used for sequences that must not be interleaved with other traffic, such as an interrupt service routine or an atomic multi-item operation.

**Signatures** (on a sequence)

```systemverilog
task          grab  (uvm_sequencer_base sequencer = null);
function void ungrab(uvm_sequencer_base sequencer = null);
task          lock  (uvm_sequencer_base sequencer = null);
function void unlock(uvm_sequencer_base sequencer = null);
```

`null` means the sequencer the sequence is running on.

**`grab` and `lock`**

| | `lock` | `grab` |
| --- | --- | --- |
| When it takes effect | Queued like a normal request: granted when it reaches the front of the arbitration queue | Placed at the front of the queue: granted as soon as the item in progress finishes |
| Yields to | Requests already ahead of it | Only an existing lock or grab |
| Use for | Atomic sequences that can wait their turn | Urgent sequences |

Both block until granted. While one is held, only the holder and its child sequences can send items.

**Example**

```systemverilog
class fifo_atomic_burst_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_atomic_burst_seq)

    task body();
        grab();                                // nothing else gets in between
        repeat (4) begin
            req = fifo_transaction::type_id::create("req");
            start_item(req);
            if (!req.randomize() with { delay == 0; }) `uvm_error("SEQ", "randomize failed")
            finish_item(req);
        end
        ungrab();
    endtask
endclass
```

**Notes**

- Always release. A sequence that ends without `ungrab()` / `unlock()` has its locks removed by the sequencer, but one that is stuck inside its `body()` holding a grab starves everything else.
- `is_blocked()` tells a sequence whether another sequence's lock is currently stopping it; `has_lock()` whether it holds one itself.
- On the sequencer, `is_grabbed()` and `current_grabber()` report the state, and `stop_sequences()` clears everything.
- Priorities and the arbitration mode still apply among the holder's own child sequences.

**See also**: `set_arbitration`, `uvm_sequencer_arb_mode`, `uvm_sequencer`, `uvm_sequence_base`, `start_item`
