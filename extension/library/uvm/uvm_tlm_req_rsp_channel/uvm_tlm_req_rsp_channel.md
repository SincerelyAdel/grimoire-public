**`uvm_tlm_req_rsp_channel`** — a pair of FIFOs carrying requests one way and responses the other

Packages a request FIFO and a response FIFO behind master and slave exports, so two components can exchange requests and responses without their own buffering. `uvm_tlm_transport_channel` is the variant with FIFO depths of 1 and an added `transport` export.

**Declaration**

```systemverilog
class uvm_tlm_req_rsp_channel #(type REQ = int, type RSP = REQ) extends uvm_component;
    function new(string name, uvm_component parent = null,
                 int request_fifo_size = 1, int response_fifo_size = 1);
```

**Exports**

| Member | Used by | Interface |
| --- | --- | --- |
| `master_export` | Initiator | `put` request, `get`/`peek` response |
| `slave_export` | Target | `get`/`peek` request, `put` response |
| `put_request_export`, `get_peek_response_export` | Initiator | The same, separately |
| `get_peek_request_export`, `put_response_export` | Target | The same, separately |
| `request_ap`, `response_ap` | Observers | Analysis ports that publish every request and response |

**See also**: `uvm_tlm_fifo`, `uvm_blocking_put_port`, `uvm_analysis_port`

---

**Coding example**

```systemverilog
class fifo_initiator extends uvm_component;
    uvm_master_port #(fifo_transaction, fifo_transaction) port;
    task run_phase(uvm_phase phase);
        fifo_transaction req, rsp;
        req = fifo_transaction::type_id::create("req");
        port.put(req);
        port.get(rsp);
    endtask
endclass

class fifo_target extends uvm_component;
    uvm_slave_port #(fifo_transaction, fifo_transaction) port;
    task run_phase(uvm_phase phase);
        fifo_transaction req, rsp;
        forever begin
            port.get(req);
            $cast(rsp, req.clone());
            port.put(rsp);
        end
    endtask
endclass

// Parent
uvm_tlm_req_rsp_channel #(fifo_transaction) channel = new("channel", this);
initiator.port.connect(channel.master_export);
target.port.connect(channel.slave_export);
channel.request_ap.connect(cov.analysis_export);
```

---

**Visual**

<img src="behavior.svg" width="300">
