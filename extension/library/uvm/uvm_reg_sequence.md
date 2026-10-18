**`uvm_reg_sequence`** — base class for sequences that operate on a register model

A sequence with a `model` handle to a register block and convenience tasks for accessing registers. Extend it for register-level stimulus such as configuration and initialisation routines. It can also act as a translation layer when a register model sits on top of another sequencer.

**Declaration**

```systemverilog
class uvm_reg_sequence #(type BASE = uvm_sequence #(uvm_reg_item)) extends BASE;
    uvm_reg_block   model;
    uvm_reg_adapter adapter;
    uvm_sequencer #(uvm_reg_item) reg_seqr;
```

**Convenience tasks**

| Task | Equivalent to |
| --- | --- |
| `write_reg(rg, status, value, ...)` | `rg.write(status, value, .parent(this))` |
| `read_reg(rg, status, value, ...)` | `rg.read(status, value, .parent(this))` |
| `poke_reg` / `peek_reg` | Backdoor `rg.poke` / `rg.peek` |
| `update_reg(rg, status, ...)` | `rg.update(status, .parent(this))` |
| `mirror_reg(rg, status, check, ...)` | `rg.mirror(status, check, .parent(this))` |
| `write_mem` / `read_mem` / `poke_mem` / `peek_mem` | The same for memories |

**Example**

```systemverilog
class fifo_init_seq extends uvm_reg_sequence;
    `uvm_object_utils(fifo_init_seq)

    fifo_reg_block regmodel;

    function new(string name = "fifo_init_seq");
        super.new(name);
    endfunction

    task body();
        uvm_status_e   status;
        uvm_reg_data_t value;

        if (!$cast(regmodel, model)) `uvm_fatal("FIFO_INIT", "model is not a fifo_reg_block")

        write_reg(regmodel.ctrl, status, 32'h0000_0C01);
        read_reg(regmodel.status, status, value);
        if (value[0] !== 1'b1) `uvm_error("FIFO_INIT", "FIFO not empty after init")
    endtask
endclass

// In the test
fifo_init_seq seq = fifo_init_seq::type_id::create("seq");
seq.model = env.regmodel;
seq.start(null);          // register accesses pick their sequencer from the map
```

**Notes**

- Starting it on `null` is normal: each access is routed through the map to the right bus sequencer.
- Passing `.parent(this)` (which the convenience tasks do for you) makes the bus items children of this sequence, so priorities and locks propagate.
- The built-in test sequences `uvm_reg_hw_reset_seq`, `uvm_reg_bit_bash_seq` and `uvm_reg_access_seq` derive from this class.

**See also**: `uvm_reg_block`, `uvm_reg`, `uvm_reg_hw_reset_seq`, `uvm_sequence`, `uvm_status_e`
