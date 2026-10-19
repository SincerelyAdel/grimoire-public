**`uvm_reg_adapter`** — converts generic register operations to and from a bus agent's transaction

The register model is bus-independent: it describes an access as a `uvm_reg_bus_op` (address, data, read or write, status). The adapter is the small user-written class that translates that into the sequence item of a real bus agent, and translates observed or returned bus items back. One adapter per bus protocol makes any register model usable on that bus.

**Declaration**

```systemverilog
virtual class uvm_reg_adapter extends uvm_object;
    function new(string name = "");

    bit supports_byte_enable;
    bit provides_responses;
    uvm_sequence_base parent_sequence;

    pure virtual function uvm_sequence_item reg2bus(const ref uvm_reg_bus_op rw);
    pure virtual function void bus2reg(uvm_sequence_item bus_item, ref uvm_reg_bus_op rw);
    virtual function uvm_reg_item get_item();
```

| Member | Meaning |
| --- | --- |
| `reg2bus` | Build a bus item from a register operation. Called for every frontdoor access. |
| `bus2reg` | Fill a register operation from a bus item. Called on the response, and by the predictor for every monitored item. |
| `supports_byte_enable` | Set to 1 if the bus can write individual bytes |
| `provides_responses` | Set to 1 if the driver returns a separate response item instead of updating the request |

**Example**

```systemverilog
class apb_reg_adapter extends uvm_reg_adapter;
    `uvm_object_utils(apb_reg_adapter)

    function new(string name = "apb_reg_adapter");
        super.new(name);
        supports_byte_enable = 0;
        provides_responses   = 0;
    endfunction

    virtual function uvm_sequence_item reg2bus(const ref uvm_reg_bus_op rw);
        apb_transaction tr = apb_transaction::type_id::create("tr");
        tr.write = (rw.kind == UVM_WRITE);
        tr.addr  = rw.addr;
        tr.wdata = rw.data;
        return tr;
    endfunction

    virtual function void bus2reg(uvm_sequence_item bus_item, ref uvm_reg_bus_op rw);
        apb_transaction tr;
        if (!$cast(tr, bus_item)) begin
            `uvm_fatal("APB_ADAPTER", "bus_item is not an apb_transaction")
            return;
        end
        rw.kind   = tr.write ? UVM_WRITE : UVM_READ;
        rw.addr   = tr.addr;
        rw.data   = tr.write ? tr.wdata : tr.rdata;
        rw.status = tr.slverr ? UVM_NOT_OK : UVM_IS_OK;
    endfunction
endclass

// Environment
adapter = apb_reg_adapter::type_id::create("adapter");
regmodel.default_map.set_sequencer(apb_agt.sqr, adapter);
```

**Notes**

- For reads to work, the driver must put the read data either back into the request item (`provides_responses = 0`) or into a response (`provides_responses = 1`). A mismatch here is the usual cause of reads returning 0.
- `get_item()` returns the `uvm_reg_item` being processed, giving access to extension data passed by the test.
- `bus2reg` must set `rw.status`; leaving it unset reports every access as not OK.

**See also**: `uvm_reg_bus_op`, `uvm_reg_map`, `uvm_reg_predictor`, `uvm_reg_item`, `uvm_reg_block`
