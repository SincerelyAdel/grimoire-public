**`get_next_item`** — the driver's blocking request for the next sequence item

Called by a driver on its `seq_item_port`. It blocks until some sequence on the connected sequencer has an item ready, then returns that item. The sequence that sent it stays blocked in `finish_item()` until the driver calls `item_done()`.

**Signature**

```systemverilog
virtual task get_next_item(output REQ t);
```

**Example**

```systemverilog
task run_phase(uvm_phase phase);
    vif.wr_drv_cb.wr_en <= 1'b0;
    @(posedge vif.rst_n);
    forever begin
        seq_item_port.get_next_item(req);
        `uvm_info("FIFO_WR_DRV", {"driving ", req.convert2string()}, UVM_HIGH)
        drive_item(req);
        seq_item_port.item_done();
    end
endtask
```

**Rules**

- Each `get_next_item` must be matched by exactly one `item_done` before the next call. Calling it twice in a row is reported as an error.
- The item returned is the very object the sequence created, not a copy. Do not change its stimulus fields; writing status or response fields back into it is a common and accepted way to return results.
- While the driver is between `get_next_item` and `item_done`, the sequencer does not arbitrate, so no other item can overtake.

**Related calls**

| Call | Behaviour |
| --- | --- |
| `get_next_item(req)` | Blocks until an item is available |
| `try_next_item(req)` | Returns immediately; `req` is null if nothing is ready |
| `get(req)` | `get_next_item` plus an immediate `item_done`; for pipelined drivers |
| `peek(req)` | Returns the next item without starting it |

**Notes**

- If the driver must keep the bus alive with idle cycles while no item is pending, use `try_next_item`.
- On reset, a driver that was in the middle of an item should still call `item_done()` (or the sequences should be stopped with `stop_sequences()`), or the handshake is left hanging.

**See also**: `item_done`, `try_next_item`, `seq_item_port`, `uvm_seq_item_pull_port`, `start_item`, `finish_item`, `uvm_driver`
