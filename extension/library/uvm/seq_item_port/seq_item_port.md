**`seq_item_port`** — the driver's built-in port for pulling items from the sequencer

A member of every `uvm_driver`, of type `uvm_seq_item_pull_port #(REQ, RSP)`. The driver calls methods on it to fetch the next sequence item and to report that the item is finished. It must be connected to the sequencer's `seq_item_export` in the agent's `connect_phase`.

**Declaration** (in `uvm_driver`)

```systemverilog
uvm_seq_item_pull_port #(REQ, RSP) seq_item_port;
```

**Example**

```systemverilog
// Agent
function void connect_phase(uvm_phase phase);
    super.connect_phase(phase);
    if (get_is_active() == UVM_ACTIVE)
        drv.seq_item_port.connect(sqr.seq_item_export);
endfunction

// Driver
task run_phase(uvm_phase phase);
    forever begin
        seq_item_port.get_next_item(req);    // blocks until a sequence sends an item
        drive_item(req);
        seq_item_port.item_done();           // releases finish_item() in the sequence
    end
endtask
```

**The handshake**

| Sequence | Sequencer | Driver |
| --- | --- | --- |
| `start_item(req)` waits | arbitrates, grants | `get_next_item(req)` waiting |
| randomizes, `finish_item(req)` sends and waits | passes the item | `get_next_item` returns; drives pins |
| `finish_item` returns | | `item_done()` |

**Methods**

`get_next_item`, `try_next_item`, `item_done`, `get`, `peek`, `put`, `put_response`, `has_do_available`. See `uvm_seq_item_pull_port` for details.

**Notes**

- An unconnected `seq_item_port` is reported at end of elaboration as a connection-count error, and the driver would otherwise block forever.
- It is created by `uvm_driver`'s constructor; never construct it yourself.
- The connection goes port to export: `drv.seq_item_port.connect(sqr.seq_item_export)`, never the reverse.

**See also**: `seq_item_export`, `uvm_seq_item_pull_port`, `get_next_item`, `item_done`, `uvm_driver`, `uvm_sequencer`, `rsp_port`
