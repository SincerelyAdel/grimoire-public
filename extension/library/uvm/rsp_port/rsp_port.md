**`rsp_port`** — the driver's analysis port for sending responses to the sequencer

A member of every `uvm_driver`, of type `uvm_analysis_port #(RSP)`. It is an alternative to `item_done(rsp)` and `seq_item_port.put(rsp)` for returning a response: the driver writes the response, and the sequencer's `rsp_export` routes it to the sequence that sent the request.

**Declaration** (in `uvm_driver`)

```systemverilog
uvm_analysis_port #(RSP) rsp_port;
```

**Notes**

- `rsp.set_id_info(req)` copies the sequence ID and transaction ID; without it the sequencer cannot find the destination and reports "Dropping response ... sequence not found".
- If the driver sends responses, every sequence must collect them with `get_response()` or use a response handler, or the response queue overflows (default depth 8).
- Most drivers that return responses simply use `item_done(rsp)`; `rsp_port` is for pipelined protocols where the response comes later.

**See also**: `seq_item_port`, `seq_item_export`, `get_response`, `set_id_info`, `item_done`, `uvm_driver`

---

**Coding example**

```systemverilog
// Agent
drv.seq_item_port.connect(sqr.seq_item_export);
drv.rsp_port.connect(sqr.rsp_export);

// Driver
seq_item_port.get_next_item(req);
drive_item(req);
seq_item_port.item_done();

$cast(rsp, req.clone());
rsp.set_id_info(req);            // required for routing
rsp.legal = !vif.overflow;
rsp_port.write(rsp);

// Sequence
start_item(req);
finish_item(req);
get_response(rsp);
```

---

**Visual**

<img src="behavior.svg" width="300">
