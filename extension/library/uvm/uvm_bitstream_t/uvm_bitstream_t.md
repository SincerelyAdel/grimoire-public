**`uvm_bitstream_t`** — the library's wide 4-state integer type

A packed `logic` vector, `UVM_MAX_STREAMBITS` bits wide (4096 by default), that the library uses wherever it handles an integral value of unknown width: field automation, packing, printing, and the integer forms of the configuration interface. Its practical importance is in the configuration database, where it is the type that integer settings must have to be picked up automatically.

**Declaration**

```systemverilog
`define UVM_MAX_STREAMBITS 4096
typedef logic signed [`UVM_MAX_STREAMBITS-1:0] uvm_bitstream_t;

// UVM 1.2 adds a cheaper 64-bit type for the common case
typedef logic signed [63:0] uvm_integral_t;
```

**Where the type matters**

| Situation | Type to use in `uvm_config_db` |
| --- | --- |
| Setting `is_active` on a `uvm_agent` in UVM 1.1d | `uvm_bitstream_t` |
| Setting a field registered with `` `uvm_field_int `` or `` `uvm_field_enum `` | `uvm_bitstream_t` (UVM 1.2 also accepts `int`, `int unsigned`, `uvm_integral_t`) |
| Reading a value given with `+uvm_set_config_int` | `uvm_bitstream_t` |
| Reading a value written with the legacy `set_config_int` | `uvm_bitstream_t` |
| Your own explicit `set` and `get` pair | Any type, as long as both sides use the same one |

**Example**

```systemverilog
// Picked up by uvm_agent::build_phase in every UVM version
uvm_config_db #(uvm_bitstream_t)::set(this, "env.wr_agt", "is_active", UVM_PASSIVE);

// Picked up by `uvm_field_int(depth, UVM_DEFAULT) during super.build_phase
uvm_config_db #(uvm_bitstream_t)::set(this, "env", "depth", 64);

// Explicit read of a command-line integer
uvm_bitstream_t value;
if (uvm_config_db #(uvm_bitstream_t)::get(this, "", "depth", value))
    depth = value;
```

**Notes**

- `uvm_config_db #(int)` and `uvm_config_db #(uvm_bitstream_t)` are different databases as far as lookup is concerned. A value stored under one type is invisible under the other, with no error.
- The width can be changed by defining `UVM_MAX_STREAMBITS` at compile time, when fields wider than 4096 bits must be packed.
- Passing such a wide value around is slow, which is one reason UVM 1.2 introduced `uvm_integral_t`.

**See also**: `uvm_config_db`, `is_active`, `set_config_int`, `uvm_set_config_int`, `apply_config_settings`, `uvm_field_int`
