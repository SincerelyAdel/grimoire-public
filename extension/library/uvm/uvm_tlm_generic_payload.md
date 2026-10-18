**`uvm_tlm_generic_payload`** — the standard TLM-2.0 bus transaction

A ready-made transaction modelled on the SystemC TLM-2.0 generic payload. It describes a memory-mapped read or write with address, data, byte enables and a response status, so that models from different sources can exchange bus traffic without agreeing on a custom class. It is used with the TLM-2 sockets (`uvm_tlm_b_initiator_socket`, `uvm_tlm_nb_target_socket` and so on).

**Declaration**

```systemverilog
class uvm_tlm_generic_payload extends uvm_sequence_item;
    rand bit [63:0]               m_address;
    rand uvm_tlm_command_e        m_command;         // UVM_TLM_READ_COMMAND, UVM_TLM_WRITE_COMMAND, UVM_TLM_IGNORE_COMMAND
    rand byte unsigned            m_data[];
    rand int unsigned             m_length;
    rand uvm_tlm_response_status_e m_response_status;
    rand byte unsigned            m_byte_enable[];
    rand int unsigned             m_byte_enable_length;
    rand int unsigned             m_streaming_width;
```

**Accessors**

| Method | Purpose |
| --- | --- |
| `set_address` / `get_address` | 64-bit address |
| `set_command`, `set_read()`, `set_write()`, `is_read()`, `is_write()` | Command |
| `set_data(ref byte unsigned p[])` / `get_data(output byte unsigned p[])` | Data bytes |
| `set_data_length` / `get_data_length` | Number of bytes |
| `set_byte_enable` / `get_byte_enable`, `set_byte_enable_length` | Byte enables, `8'hFF` per enabled byte |
| `set_streaming_width` / `get_streaming_width` | Address wrap width for streaming |
| `set_response_status` / `get_response_status`, `is_response_ok()`, `is_response_error()`, `get_response_string()` | Response |
| `set_extension` / `get_extension` / `clear_extension` | Attach protocol-specific `uvm_tlm_extension` objects |

**Example**

```systemverilog
class mem_initiator extends uvm_component;
    `uvm_component_utils(mem_initiator)
    uvm_tlm_b_initiator_socket #(uvm_tlm_generic_payload) socket;

    function new(string name, uvm_component parent);
        super.new(name, parent);
        socket = new("socket", this);
    endfunction

    task run_phase(uvm_phase phase);
        uvm_tlm_generic_payload gp = uvm_tlm_generic_payload::type_id::create("gp");
        uvm_tlm_time            delay = new("delay");
        byte unsigned           data[] = '{8'hDE, 8'hAD, 8'hBE, 8'hEF};

        gp.set_write();
        gp.set_address(64'h1000);
        gp.set_data(data);
        gp.set_data_length(4);
        gp.set_streaming_width(4);
        gp.set_response_status(UVM_TLM_INCOMPLETE_RESPONSE);

        socket.b_transport(gp, delay);
        if (!gp.is_response_ok())
            `uvm_error("MEM", {"write failed: ", gp.get_response_string()})
    endtask
endclass
```

**Notes**

- The initiator sets the status to `UVM_TLM_INCOMPLETE_RESPONSE`; the target must change it, normally to `UVM_TLM_OK_RESPONSE`.
- TLM-2 passes the transaction by reference and adds a timing annotation (`uvm_tlm_time`) and, for the non-blocking interface, a phase argument.
- Most block-level UVM agents use their own sequence item and TLM-1 instead. The generic payload matters mainly when connecting to SystemC or virtual-platform models.

**See also**: `uvm_sequence_item`, `uvm_blocking_put_port`, `uvm_reg_adapter`
