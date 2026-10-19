**`uvm_seq_item_pull_port`** — the port type a driver uses to pull items from a sequencer

The class behind every driver's `seq_item_port`. It gives the driver the sequencer interface: request the next item, signal completion, and optionally return a response. The matching class on the sequencer is `uvm_seq_item_pull_imp`, exposed as `seq_item_export`.

**Declaration**

```systemverilog
class uvm_seq_item_pull_port #(type REQ = int, type RSP = REQ)
    extends uvm_port_base #(uvm_sqr_if_base #(REQ, RSP));
```

**Interface methods**

| Method | Kind | Purpose |
| --- | --- | --- |
| `get_next_item(output REQ req)` | task | Block until an item is available; the item stays "in progress" |
| `try_next_item(output REQ req)` | task | Return at once with `null` if no sequence has an item ready |
| `item_done(input RSP rsp = null)` | function | Finish the current item and unblock `finish_item()` in the sequence |
| `get(output REQ req)` | task | `get_next_item` followed immediately by `item_done` |
| `peek(output REQ req)` | task | Look at the next item without consuming it |
| `put(input RSP rsp)` | task | Send a response at any later time |
| `put_response(input RSP rsp)` | function | Same as `put`, as a function |
| `has_do_available()` | function | 1 if a sequence has an item ready |
| `wait_for_sequences()` | task | Wait a few delta cycles for sequences to produce an item |

**Notes**

- Each `get_next_item` must be followed by exactly one `item_done` before the next `get_next_item`. Violating this is reported as an error ("get_next_item called twice without item_done or get in between").
- The port accepts exactly one connection: one driver, one sequencer.

**See also**: `seq_item_port`, `seq_item_export`, `get_next_item`, `try_next_item`, `item_done`, `uvm_driver`, `uvm_sequencer`

---

**Coding example**

```systemverilog
// Agent
drv.seq_item_port.connect(sqr.seq_item_export);

// Driver: standard loop
forever begin
    seq_item_port.get_next_item(req);
    drive_item(req);
    seq_item_port.item_done();
end

// Driver: idle cycles when nothing is pending
forever begin
    seq_item_port.try_next_item(req);
    if (req == null) drive_idle();
    else begin
        drive_item(req);
        seq_item_port.item_done();
    end
end

// Driver: pipelined, response returned later
forever begin
    seq_item_port.get(req);                 // completes the request side at once
    fork
        automatic fifo_transaction item = req;
        begin
            drive_item(item);
            seq_item_port.put(make_rsp(item));
        end
    join_none
end
```

---

**Visual**

<img src="behavior.svg" width="300">
