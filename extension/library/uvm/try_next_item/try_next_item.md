**`try_next_item`** — the driver's non-blocking request for the next sequence item

Like `get_next_item`, but it does not wait. If a sequence has an item ready, it returns that item; if not, it returns `null` straight away. This lets a driver do something useful, typically drive an idle cycle, when there is no stimulus.

**Signature**

```systemverilog
virtual task try_next_item(output REQ t);
```

It is a task because it may consume delta cycles while sequences get a chance to produce an item, but it never consumes simulation time.

**Rules**

- Call `item_done()` only when an item was actually returned. Calling it after a null result is an error ("Item_done() called with no outstanding requests").
- A non-null result must be followed by `item_done()` before the next `try_next_item` or `get_next_item`.

**When to use it**

| Protocol behaviour | Call |
| --- | --- |
| The bus may simply stop when there is nothing to send | `get_next_item` |
| The bus must show a defined idle or keep a clocked handshake running every cycle | `try_next_item` |

**See also**: `get_next_item`, `item_done`, `seq_item_port`, `uvm_seq_item_pull_port`, `uvm_driver`

---

**Coding example**

```systemverilog
task run_phase(uvm_phase phase);
    forever begin
        @(vif.wr_drv_cb);
        seq_item_port.try_next_item(req);
        if (req == null) begin
            vif.wr_drv_cb.wr_en <= 1'b0;            // idle cycle
        end else begin
            vif.wr_drv_cb.data_in <= req.data;
            vif.wr_drv_cb.wr_en   <= 1'b1;
            seq_item_port.item_done();
        end
    end
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
