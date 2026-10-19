**`uvm_reg_block`** — register-layer container for registers, memories, maps and sub-blocks

The top of a register model. A block instantiates the registers and memories of one design unit, defines one or more address maps over them, and can contain other blocks, mirroring the design hierarchy. The environment creates the top block, calls `build()` and `lock_model()`, and connects its map to a bus agent.

**Declaration**

```systemverilog
virtual class uvm_reg_block extends uvm_object;
    function new(string name = "", int has_coverage = UVM_NO_COVERAGE);

    virtual function uvm_reg_map create_map(string name, uvm_reg_addr_t base_addr,
                                            int unsigned n_bytes, uvm_endianness_e endian,
                                            bit byte_addressing = 1);
    virtual function void lock_model();
    uvm_reg_map default_map;
```

**Main methods**

| Method | Purpose |
| --- | --- |
| `build()` | User-defined: create and configure everything in the block |
| `create_map(...)` | Create an address map |
| `lock_model()` | Freeze the structure and compute addresses; required before use |
| `reset(string kind = "HARD")` | Set every mirror to its reset value |
| `update(output status, ...)` | Write every register whose desired value differs from its mirror |
| `mirror(output status, input check = UVM_NO_CHECK, ...)` | Read every register |
| `get_registers(ref regs[$])`, `get_reg_by_name(name)`, `get_field_by_name(name)` | Lookup |
| `set_hdl_path_root(path)` / `add_hdl_path(path)` | Backdoor paths |
| `get_default_map()`, `get_map_by_name(name)` | Maps |

**Example**

```systemverilog
class fifo_reg_block extends uvm_reg_block;
    `uvm_object_utils(fifo_reg_block)

    rand fifo_ctrl_reg   ctrl;
    rand fifo_status_reg status;

    function new(string name = "fifo_reg_block");
        super.new(name, UVM_NO_COVERAGE);
    endfunction

    virtual function void build();
        ctrl = fifo_ctrl_reg::type_id::create("ctrl");
        ctrl.configure(this, null, "u_csr.ctrl_q");      // parent, regfile, hdl path
        ctrl.build();

        status = fifo_status_reg::type_id::create("status");
        status.configure(this, null, "u_csr.status_q");
        status.build();

        default_map = create_map("default_map", 'h0, 4, UVM_LITTLE_ENDIAN);
        default_map.add_reg(ctrl,   'h00, "RW");
        default_map.add_reg(status, 'h04, "RO");

        lock_model();
    endfunction
endclass

// Environment
function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    regmodel = fifo_reg_block::type_id::create("regmodel");
    regmodel.build();
    regmodel.set_hdl_path_root("tb_fifo.dut");
    uvm_config_db #(fifo_reg_block)::set(this, "*", "regmodel", regmodel);
endfunction

function void connect_phase(uvm_phase phase);
    regmodel.default_map.set_sequencer(bus_agt.sqr, adapter);
    predictor.map     = regmodel.default_map;
    predictor.adapter = adapter;
    bus_agt.ap.connect(predictor.bus_in);
endfunction
```

**Notes**

- Call `reset()` on the model whenever the DUT is reset, or the mirror and the hardware disagree.
- A block is a `uvm_object`, not a component; pass it around through the configuration database or sequence properties.

**See also**: `uvm_reg`, `uvm_reg_map`, `uvm_reg_adapter`, `uvm_reg_predictor`, `uvm_mem`, `uvm_reg_sequence`
