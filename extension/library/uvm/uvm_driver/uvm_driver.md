**`uvm_driver`** — base class for the component that turns sequence items into pin activity

A driver pulls transactions from a sequencer, one at a time, and drives them onto the DUT interface with the protocol's timing. It is the only component that knows both the transaction and the signal-level protocol on the stimulus side.

**Declaration**

```systemverilog
class uvm_driver #(type REQ = uvm_sequence_item,
                   type RSP = REQ) extends uvm_component;

    uvm_seq_item_pull_port #(REQ, RSP) seq_item_port;
    uvm_analysis_port #(RSP)           rsp_port;
    REQ req;
    RSP rsp;

    function new(string name, uvm_component parent);
```

| Member | Purpose |
| --- | --- |
| `seq_item_port` | Pull port connected to the sequencer's `seq_item_export`. |
| `rsp_port` | Analysis port for sending responses, an alternative to `item_done(rsp)`. |
| `req`, `rsp` | Ready-made handles of the request and response types. |

**The two handshake styles**

| Style | Calls | Use when |
| --- | --- | --- |
| Blocking, one at a time | `get_next_item(req)` ... `item_done()` | The normal case |
| Non-blocking | `try_next_item(req)`; drive idle if null | The bus must show idle cycles when no item is ready |
| Pipelined | `get(req)` then later `put(rsp)` or `rsp_port.write(rsp)` | Several items are in flight at once |

**Returning a response**

```systemverilog
seq_item_port.get_next_item(req);
drive_item(req);
$cast(rsp, req.clone());
rsp.set_id_info(req);          // required so the sequencer can route it
rsp.status = vif.wr_ack;
seq_item_port.item_done(rsp);
```

**Notes**

- Never raise objections in a driver's `forever` loop per item; it is slow. The test or sequence controls the end of the test.
- Do not modify the `req` handle's stimulus fields; the sequence still holds the same object.
- Drive through a clocking block to avoid races with the DUT.
- Handle reset: a robust driver aborts the current item and returns the interface to idle when reset asserts.

**See also**: `uvm_sequencer`, `uvm_sequence_item`, `seq_item_port`, `get_next_item`, `item_done`, `try_next_item`, `uvm_monitor`, `uvm_agent`

---

**Coding example**

```systemverilog
class fifo_wr_driver extends uvm_driver #(fifo_transaction);
    `uvm_component_utils(fifo_wr_driver)

    virtual fifo_if.wr_driver vif;

    function new(string name = "fifo_wr_driver", uvm_component parent = null);
        super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        if (!uvm_config_db #(virtual fifo_if.wr_driver)::get(this, "", "vif", vif))
            `uvm_fatal("FIFO_WR_DRV", "No virtual interface set for fifo_wr_driver.vif")
    endfunction

    task run_phase(uvm_phase phase);
        vif.wr_drv_cb.wr_en   <= 1'b0;
        vif.wr_drv_cb.data_in <= '0;
        @(posedge vif.rst_n);
        forever begin
            seq_item_port.get_next_item(req);
            drive_item(req);
            seq_item_port.item_done();
        end
    endtask

    task drive_item(fifo_transaction item);
        repeat (item.delay) @(vif.wr_drv_cb);
        vif.wr_drv_cb.data_in <= item.data;
        vif.wr_drv_cb.wr_en   <= 1'b1;
        @(vif.wr_drv_cb);
        vif.wr_drv_cb.wr_en   <= 1'b0;
    endtask
endclass
```

---

**Visual**

<img src="behavior.svg" width="300">
