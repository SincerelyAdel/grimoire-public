**`uvm_reg_map`** — register-layer address map

Assigns addresses to registers and memories and links the register model to a physical bus. When a test calls `reg.write()`, the map works out the address, turns the access into one or more generic bus operations, and executes them on a sequencer through a `uvm_reg_adapter`. A block can have several maps when the same registers are reachable over more than one bus.

**Main methods**

```systemverilog
function void configure(uvm_reg_block parent, uvm_reg_addr_t base_addr,
                        int unsigned n_bytes, uvm_endianness_e endian,
                        bit byte_addressing = 1);

virtual function void add_reg(uvm_reg rg, uvm_reg_addr_t offset, string rights = "RW",
                              bit unmapped = 0, uvm_reg_frontdoor frontdoor = null);
virtual function void add_mem(uvm_mem mem, uvm_reg_addr_t offset, string rights = "RW",
                              bit unmapped = 0, uvm_reg_frontdoor frontdoor = null);
virtual function void add_submap(uvm_reg_map child_map, uvm_reg_addr_t offset);

virtual function void set_sequencer(uvm_sequencer_base sequencer, uvm_reg_adapter adapter = null);
function void set_auto_predict(bit on = 1);
function void set_check_on_read(bit on = 1);
function void set_base_addr(uvm_reg_addr_t offset);

virtual function uvm_reg get_reg_by_offset(uvm_reg_addr_t offset, bit read = 1);
virtual function uvm_reg_addr_t get_base_addr(uvm_hier_e hier = UVM_HIER);
```

| Argument | Meaning |
| --- | --- |
| `n_bytes` | Bus data width in bytes |
| `endian` | Byte order when a register is wider than the bus: `UVM_LITTLE_ENDIAN`, `UVM_BIG_ENDIAN`, ... |
| `byte_addressing` | 1 if addresses count bytes, 0 if they count bus words |
| `rights` | `"RW"`, `"RO"` or `"WO"`: what this map allows |

**Example**

```systemverilog
// In the block's build()
default_map = create_map("default_map", 'h4000_0000, 4, UVM_LITTLE_ENDIAN);
default_map.add_reg(ctrl,   'h00, "RW");
default_map.add_reg(status, 'h04, "RO");

// In the environment's connect_phase
regmodel.default_map.set_sequencer(bus_agt.sqr, adapter);
regmodel.default_map.set_auto_predict(0);        // an explicit predictor is connected
```

**Prediction modes**

| Mode | How the mirror is updated |
| --- | --- |
| Auto predict (`set_auto_predict(1)`) | From the model's own read and write calls. Simple, but blind to bus traffic from other sources. |
| Explicit predictor | From a `uvm_reg_predictor` fed by the bus monitor. Sees every access; the recommended setup. |

**Notes**

- Only the top-level map needs a sequencer; sub-maps inherit it.
- `set_check_on_read(1)` compares every read value against the mirror automatically.
- `get_reg_by_offset` is the reverse lookup used by predictors and by address-based checkers.

**See also**: `uvm_reg_block`, `uvm_reg`, `uvm_reg_adapter`, `uvm_reg_predictor`, `uvm_path_e`
