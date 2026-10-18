**`uvm_reg_bus_op`** — struct describing one generic bus read or write

The protocol-independent description of a single bus cycle that the register layer passes to and from a `uvm_reg_adapter`. `reg2bus` receives one and builds a bus item from it; `bus2reg` fills one in from a bus item.

**Declaration**

```systemverilog
typedef struct {
    uvm_access_e   kind;       // UVM_READ or UVM_WRITE
    uvm_reg_addr_t addr;       // bus address
    uvm_reg_data_t data;       // write data, or read data on return
    int            n_bits;     // number of valid data bits
    uvm_reg_byte_en_t byte_en; // one bit per byte lane
    uvm_status_e   status;     // UVM_IS_OK, UVM_NOT_OK, UVM_HAS_X
} uvm_reg_bus_op;
```

**Related types**

| Type | Default width | Macro that sets it |
| --- | --- | --- |
| `uvm_reg_addr_t` | 64 bits | `UVM_REG_ADDR_WIDTH` |
| `uvm_reg_data_t` | 64 bits | `UVM_REG_DATA_WIDTH` |
| `uvm_reg_byte_en_t` | 8 bits | `UVM_REG_BYTENABLE_WIDTH` |

`uvm_access_e` has the values `UVM_READ`, `UVM_WRITE`, `UVM_BURST_READ` and `UVM_BURST_WRITE`.

**Example**

```systemverilog
virtual function uvm_sequence_item reg2bus(const ref uvm_reg_bus_op rw);
    apb_transaction tr = apb_transaction::type_id::create("tr");
    tr.write = (rw.kind == UVM_WRITE);
    tr.addr  = rw.addr;
    tr.wdata = rw.data;
    tr.strb  = rw.byte_en[3:0];
    return tr;
endfunction

virtual function void bus2reg(uvm_sequence_item bus_item, ref uvm_reg_bus_op rw);
    apb_transaction tr;
    void'($cast(tr, bus_item));
    rw.kind   = tr.write ? UVM_WRITE : UVM_READ;
    rw.addr   = tr.addr;
    rw.data   = tr.write ? tr.wdata : tr.rdata;
    rw.status = UVM_IS_OK;
endfunction
```

**Notes**

- It is a struct, not a class: it is passed by reference (`ref` / `const ref`), has no methods and is never created with `new`.
- A register wider than the bus produces several `uvm_reg_bus_op` values, one per bus cycle.

**See also**: `uvm_reg_adapter`, `uvm_reg_item`, `uvm_status_e`, `uvm_reg_map`
