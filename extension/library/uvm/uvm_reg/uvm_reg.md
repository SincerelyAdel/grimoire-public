**`uvm_reg`** — register-layer model of one DUT register

The UVM register layer (often called RAL) mirrors the DUT's registers as objects, so tests read and write registers by name instead of by address and bus protocol. A `uvm_reg` represents one register. It contains `uvm_reg_field` objects, belongs to a `uvm_reg_block`, and is placed at an address by a `uvm_reg_map`. It tracks what the DUT is believed to hold (the mirrored value) and what the test wants it to hold (the desired value).

**Declaration**

```systemverilog
virtual class uvm_reg extends uvm_object;
    function new(string name = "", int unsigned n_bits, int has_coverage);
```

**Access methods**

| Method | What it does |
| --- | --- |
| `write(output status, input value, input path = UVM_DEFAULT_PATH, input map = null, input parent = null, ...)` | Write the DUT register, then update the mirror |
| `read(output status, output value, input path = UVM_DEFAULT_PATH, ...)` | Read the DUT register, then update the mirror |
| `set(value)` / `get()` | Change or read the desired value only; no bus activity |
| `update(output status, ...)` | Write the DUT only if desired differs from mirrored |
| `mirror(output status, input check = UVM_NO_CHECK, ...)` | Read the DUT and update the mirror, optionally comparing first |
| `predict(value, ...)` | Force the mirror to a value, for example from a monitor |
| `get_mirrored_value()` | The model's view of the DUT |
| `poke` / `peek` | Backdoor write and read, ignoring access policy |
| `reset(string kind = "HARD")` / `get_reset()` | Apply or read the reset value in the model |
| `get_address(map = null)`, `get_fields(ref fields[$])`, `get_field_by_name(name)` | Introspection |

**Example: a register definition**

```systemverilog
class fifo_ctrl_reg extends uvm_reg;
    `uvm_object_utils(fifo_ctrl_reg)

    rand uvm_reg_field enable;
    rand uvm_reg_field almost_full_level;

    function new(string name = "fifo_ctrl_reg");
        super.new(name, 32, UVM_NO_COVERAGE);
    endfunction

    virtual function void build();
        enable            = uvm_reg_field::type_id::create("enable");
        almost_full_level = uvm_reg_field::type_id::create("almost_full_level");
        //                        parent size lsb access volatile reset has_reset is_rand individually_accessible
        enable.configure           (this, 1,   0,  "RW",  0,       1'b0, 1,        1,      0);
        almost_full_level.configure(this, 8,   8,  "RW",  0,       8'd12, 1,       1,      0);
    endfunction
endclass
```

**Example: using it in a sequence**

```systemverilog
task body();
    uvm_status_e   status;
    uvm_reg_data_t value;

    regmodel.ctrl.write(status, 32'h0000_0C01, .parent(this));
    regmodel.ctrl.read(status, value, .parent(this));

    regmodel.ctrl.almost_full_level.set(8'd4);     // desired value only
    regmodel.ctrl.update(status, .parent(this));   // one bus write if anything changed

    regmodel.ctrl.mirror(status, UVM_CHECK, .parent(this));   // read back and compare
endtask
```

**Notes**

- Register models are normally generated from a register description (IP-XACT, SystemRDL, CSV), not written by hand.
- `write`/`read` are tasks that drive the bus through the map's sequencer and adapter. `set`/`get` are functions that only touch the model.
- Always check `status` (`UVM_IS_OK`, `UVM_NOT_OK`, `UVM_HAS_X`).

**See also**: `uvm_reg_field`, `uvm_reg_block`, `uvm_reg_map`, `uvm_reg_adapter`, `uvm_reg_predictor`, `uvm_reg_sequence`, `uvm_status_e`, `uvm_path_e`
