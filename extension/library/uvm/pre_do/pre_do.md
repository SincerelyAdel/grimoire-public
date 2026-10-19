**`pre_do`** — sequence hooks called around each item or sub-sequence (`pre_do`, `mid_do`, `post_do`)

Three empty virtual methods on a sequence that are called every time that sequence sends an item or runs a child sequence. They let a base sequence observe or adjust everything its derived sequences send, in one place.

**Signatures**

```systemverilog
virtual task          pre_do (bit is_item);
virtual function void mid_do (uvm_sequence_item this_item);
virtual function void post_do(uvm_sequence_item this_item);
```

| Hook | Called | Typical use |
| --- | --- | --- |
| `pre_do(is_item)` | After the sequencer grants access, before randomization. `is_item` is 1 for an item, 0 for a sequence. | Wait for a condition; last-moment setup |
| `mid_do(item)` | After randomization, just before the item is sent | Adjust or record the final item |
| `post_do(item)` | After the driver has completed the item, or the child sequence has finished | Collect results, count |

**Where they sit in the item flow**

```
start_item(req)   : wait_for_grant  ->  pre_do(1)
                    (randomize)
finish_item(req)  : mid_do(req)  ->  send_request  ->  wait_for_item_done  ->  post_do(req)
```

**Example**

```systemverilog
class fifo_base_seq extends uvm_sequence #(fifo_transaction);
    `uvm_object_utils(fifo_base_seq)

    int unsigned n_sent;
    bit          force_no_delay;

    virtual function void mid_do(uvm_sequence_item this_item);
        fifo_transaction tr;
        if ($cast(tr, this_item) && force_no_delay)
            tr.delay = 0;                     // override whatever was randomized
    endfunction

    virtual function void post_do(uvm_sequence_item this_item);
        n_sent++;
    endfunction
endclass
```

**Notes**

- The hooks called are those of the sequence doing the sending, the parent, not of the item or child being sent.
- `pre_do` is a task and may block, but the sequencer is held while it does, so every other sequence waits too.
- `mid_do` and `post_do` are functions.

**See also**: `start_item`, `finish_item`, `pre_body`, `pre_start`, `body`, `uvm_sequence_base`
