**`uvm_path_e`** — how a register access reaches the DUT (`UVM_FRONTDOOR`, `UVM_BACKDOOR`)

The `path` argument of the register and memory access tasks. It selects between driving a real bus transaction and reading or writing the storage directly through its HDL path.

**Declaration**

```systemverilog
typedef enum {
    UVM_FRONTDOOR,
    UVM_BACKDOOR,
    UVM_PREDICT,
    UVM_DEFAULT_PATH
} uvm_path_e;
```

| Value | Meaning |
| --- | --- |
| `UVM_FRONTDOOR` | Through the bus agent, using the map, the adapter and the sequencer. Takes simulation time and exercises the bus logic. |
| `UVM_BACKDOOR` | Directly on the HDL signal, through `uvm_hdl_read` / `uvm_hdl_deposit`. Takes zero time and bypasses the bus. |
| `UVM_PREDICT` | Used internally: the model is being updated, not the DUT |
| `UVM_DEFAULT_PATH` | Use the block's default, set by `set_default_door` / the `default_path` property; frontdoor unless changed |

**Example**

```systemverilog
uvm_status_e   status;
uvm_reg_data_t value;

// Configure quickly through the backdoor
regmodel.ctrl.write(status, 32'h0000_0C01, UVM_BACKDOOR);

// Verify the bus path
regmodel.ctrl.read(status, value, UVM_FRONTDOOR, .parent(this));

// Force a state the bus cannot reach, ignoring access policy
regmodel.status.poke(status, 32'h1);
```

**Frontdoor or backdoor**

| | Frontdoor | Backdoor |
| --- | --- | --- |
| Time | Bus cycles | Zero |
| Tests the bus and decode logic | Yes | No |
| Honours access policy | The hardware does | `write`/`read` mimic it; `poke`/`peek` ignore it |
| Needs | Sequencer and adapter on the map | HDL paths in the model and signal access in the simulator |

**Notes**

- A backdoor access with no HDL path defined fails with `UVM_NOT_OK` and an error.
- Mixed use is common: backdoor for bulk initialisation, frontdoor for the checks that matter.

**See also**: `uvm_reg`, `uvm_mem`, `uvm_hdl_read`, `uvm_status_e`, `uvm_reg_block`
