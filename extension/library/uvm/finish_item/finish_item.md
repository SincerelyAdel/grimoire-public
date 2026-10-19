**`finish_item`** — send the item to the driver and wait until the driver has finished it

The second half of sending a sequence item. It hands the item to the sequencer, which passes it to the driver's `get_next_item()`, and then blocks until the driver calls `item_done()`.

**Signature**

```systemverilog
virtual task finish_item(uvm_sequence_item item, int set_priority = -1);
```

**What it does internally**

1. Calls the `mid_do(item)` hook.
2. Calls `sequencer.send_request(this, item)`.
3. Calls `sequencer.wait_for_item_done(this, -1)` and blocks.
4. Calls the `post_do(item)` hook.

**The full handshake**

| Sequence | Driver |
| --- | --- |
| `start_item(req)` blocks | `get_next_item(req)` blocks |
| grant; randomize | |
| `finish_item(req)` blocks | `get_next_item` returns; pins are driven |
| `finish_item` returns | `item_done()` |

**Notes**

- When `finish_item` returns, the driver has completed the item, so status fields the driver wrote back into the same object can be read immediately.
- If the driver returns a separate response object, collect it with `get_response(rsp)` after `finish_item`.
- If the driver uses `get()` instead of `get_next_item()`, `finish_item` returns as soon as the driver has taken the item, not when it has finished driving it.

**See also**: `start_item`, `item_done`, `get_next_item`, `get_response`, `uvm_sequence`, `uvm_driver`, `pre_do`

---

**Coding example**

```systemverilog
task body();
    req = fifo_transaction::type_id::create("req");
    start_item(req);
    if (!req.randomize()) `uvm_error("FIFO_WR_SEQ", "randomize failed")
    finish_item(req);                   // returns when the driver calls item_done()

    `uvm_info("FIFO_WR_SEQ", {"sent ", req.convert2string()}, UVM_HIGH)
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
