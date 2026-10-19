**`uvm_mem`** — register-layer model of a memory

Represents a contiguous block of addressable words, such as a RAM or a FIFO storage array seen through a bus. Unlike a register it has no fields and no mirror: the model does not track contents, it only provides addressed access through the frontdoor or the backdoor.

**Declaration**

```systemverilog
class uvm_mem extends uvm_object;
    function new(string name, longint unsigned size, int unsigned n_bits,
                 string access = "RW", int has_coverage = UVM_NO_COVERAGE);

    function void configure(uvm_reg_block parent, string hdl_path = "");
```

| Argument | Meaning |
| --- | --- |
| `size` | Number of words |
| `n_bits` | Width of each word |
| `access` | `"RW"` or `"RO"` |

**Access tasks**

| Task | Purpose |
| --- | --- |
| `write(output status, input offset, input value, input path = UVM_DEFAULT_PATH, ...)` | Write one word |
| `read(output status, input offset, output value, ...)` | Read one word |
| `burst_write(output status, input offset, input value[], ...)` / `burst_read(...)` | Several consecutive words |
| `poke(output status, input offset, input value, ...)` / `peek(...)` | Backdoor access |
| `get_size()`, `get_n_bits()`, `get_address(offset, map)` | Layout |

**Example**

```systemverilog
// In the block's build()
ram = new("ram", 1024, 32);
ram.configure(this, "u_ram.mem");
default_map.add_mem(ram, 'h1000, "RW");

// In a sequence: load through the backdoor, check through the frontdoor
uvm_status_e   status;
uvm_reg_data_t value;

for (int i = 0; i < 16; i++)
    regmodel.ram.poke(status, i, i * 32'h0101_0101);

regmodel.ram.read(status, 5, value, .parent(this));
if (value !== 5 * 32'h0101_0101) `uvm_error("MEM", "read data mismatch")
```

**Notes**

- A subclass with a fixed size is the usual pattern, so that `type_id::create` needs no extra arguments: `super.new(name, 1024, 32, "RW", UVM_NO_COVERAGE)`.
- `uvm_mem_mam` is a memory allocation manager for carving a memory into regions.
- The built-in `uvm_mem_walk_seq` and `uvm_mem_access_seq` test every memory in a block.

**See also**: `uvm_reg`, `uvm_reg_block`, `uvm_reg_map`, `uvm_path_e`, `uvm_hdl_read`
