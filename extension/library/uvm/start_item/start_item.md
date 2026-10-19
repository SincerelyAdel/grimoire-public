**`start_item`** — request permission from the sequencer to send an item

The first half of sending a sequence item, called inside a sequence's `body()`. It blocks until the sequencer's arbitration selects this sequence and the driver is ready for an item. When it returns, the sequence owns the driver's attention and should randomize the item and call `finish_item()` without consuming time.

**Signature**

```systemverilog
virtual task start_item(uvm_sequence_item item,
                        int               set_priority = -1,
                        uvm_sequencer_base sequencer   = null);
```

| Argument | Meaning |
| --- | --- |
| `item` | The item to send. It must already exist. |
| `set_priority` | Priority for this item; `-1` uses the sequence's own priority |
| `sequencer` | Sequencer to send on; `null` uses the one the sequence is running on |

**Example**

```systemverilog
task body();
    repeat (n_items) begin
        req = fifo_transaction::type_id::create("req");
        start_item(req);                               // wait for grant
        if (!req.randomize() with { delay < 3; })      // late randomization
            `uvm_error("FIFO_WR_SEQ", "randomize failed")
        finish_item(req);                              // send, wait for item_done
    end
endtask
```

**What it does internally**

1. Sets the item's parent sequence and sequencer.
2. Calls `sequencer.wait_for_grant(this, set_priority)` and blocks until granted.
3. Calls the `pre_do(1)` hook.

**Why randomize after `start_item`**

The grant can come much later than the request, for example while another sequence holds the sequencer. Randomizing after the grant means the constraints see the state of the testbench at the moment the item is actually sent.

**Rules**

- No delays and no blocking calls between `start_item` and `finish_item`. The sequencer is held for that whole time and every other sequence waits.
- Every `start_item` must be followed by `finish_item` for the same item.
- Create a new item for each iteration, or clone it, if anything downstream keeps the handle.

**See also**: `finish_item`, `uvm_sequence`, `get_next_item`, `item_done`, `uvm_do`, `wait_for_grant`, `pre_do`
