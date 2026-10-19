**`set_id_info`** — tag a response with the identity of its request

Copies the sequence ID and transaction ID from one sequence item to another. A driver calls it on a response object, passing the request, so that the sequencer can deliver the response to the sequence that sent the request.

**Signature**

```systemverilog
function void set_id_info(uvm_sequence_item item);
```

**What is copied**

| Field | Set by | Used for |
| --- | --- | --- |
| Sequence ID | The sequencer, when the request is sent | Routing the response to the right sequence |
| Transaction ID | The sequencer, an incrementing number per request | Matching in `get_response(rsp, id)` |

**Notes**

- Without it the sequencer cannot route the response and reports "Dropping response for sequence 0, sequence not found".
- `clone()` and `copy()` do not copy these IDs unless the class's own `do_copy` does so, which is why `set_id_info` is needed even on a cloned request.
- Call it on the response, passing the request: `rsp.set_id_info(req)`, not the other way round.

**See also**: `get_response`, `item_done`, `rsp_port`, `uvm_sequence_item`, `uvm_driver`

---

**Coding example**

```systemverilog
task run_phase(uvm_phase phase);
    forever begin
        seq_item_port.get_next_item(req);
        drive_item(req);

        rsp = fifo_transaction::type_id::create("rsp");
        rsp.copy(req);
        rsp.set_id_info(req);              // must come before the response is sent
        rsp.legal = !vif.wr_drv_cb.full;

        seq_item_port.item_done(rsp);
    end
endtask
```

---

**Visual**

<img src="behavior.svg" width="300">
