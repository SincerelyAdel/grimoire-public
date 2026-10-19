**`seq_item_export`** — the sequencer's built-in connection point for a driver

A member of every `uvm_sequencer`, of type `uvm_seq_item_pull_imp #(REQ, RSP, this_type)`. It implements the methods the driver calls through its `seq_item_port`, by forwarding them to the sequencer's arbitration and item queues.

**Declaration** (in `uvm_sequencer`)

```systemverilog
uvm_seq_item_pull_imp #(REQ, RSP, this_type) seq_item_export;
```

**Example**

```systemverilog
class fifo_wr_agent extends uvm_agent;
    fifo_sequencer sqr;
    fifo_wr_driver drv;

    function void connect_phase(uvm_phase phase);
        super.connect_phase(phase);
        if (get_is_active() == UVM_ACTIVE)
            drv.seq_item_port.connect(sqr.seq_item_export);
    endfunction
endclass
```

**Notes**

- Despite the name, it is an imp, the terminating end of the connection, so it must be the argument of `connect`, never the caller.
- It accepts one driver. Layered protocols connect a translating sequence or an upper-layer component to a lower sequencer instead of sharing the export.
- The `REQ` / `RSP` types of the driver and the sequencer must match exactly, or `connect` fails to compile.
- If the driver also uses `rsp_port`, connect it to the sequencer's `rsp_export`: `drv.rsp_port.connect(sqr.rsp_export)`.

**See also**: `seq_item_port`, `uvm_seq_item_pull_port`, `uvm_sequencer`, `uvm_driver`, `rsp_port`
