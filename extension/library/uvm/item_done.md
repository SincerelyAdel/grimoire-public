**`item_done`** — the driver's signal that the current item is complete

Called by a driver on its `seq_item_port` after it has finished driving the item obtained with `get_next_item` or `try_next_item`. It releases the sequence that is waiting in `finish_item()` and lets the sequencer arbitrate for the next item. It can also carry a response back.

**Signature**

```systemverilog
virtual function void item_done(input RSP rsp_arg = null);
```

| Argument | Meaning |
| --- | --- |
| `rsp_arg` | Optional response object. If given, it is put in the sequencer's response queue for the sequence to collect with `get_response()`. |

**Example**

```systemverilog
// Without a response
seq_item_port.get_next_item(req);
drive_item(req);
seq_item_port.item_done();

// Returning status in the request itself
seq_item_port.get_next_item(req);
drive_item(req);
req.legal = !vif.wr_drv_cb.full;      // sequence sees it when finish_item returns
seq_item_port.item_done();

// With a separate response object
seq_item_port.get_next_item(req);
drive_item(req);
$cast(rsp, req.clone());
rsp.set_id_info(req);
rsp.legal = !vif.wr_drv_cb.full;
seq_item_port.item_done(rsp);
```

**Rules**

- It is a function and takes no time.
- Call it exactly once per item. Calling it with no item outstanding is an error.
- A response must have `set_id_info(req)` applied, so the sequencer knows which sequence it belongs to.
- If responses are sent, every sequence must consume them with `get_response()`, or the response queue overflows after 8 by default.

**See also**: `get_next_item`, `try_next_item`, `finish_item`, `get_response`, `set_id_info`, `seq_item_port`, `rsp_port`
