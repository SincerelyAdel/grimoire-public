**`set_config_int`** — legacy component configuration methods (`set_config_*`, `get_config_*`)

The OVM-style configuration interface, kept in UVM 1.1 for compatibility and deprecated in UVM 1.2. Each method is a thin wrapper around `uvm_config_db` with a fixed type. New code should call `uvm_config_db` directly.

**Signatures**

```systemverilog
virtual function void set_config_int   (string inst_name, string field_name, uvm_bitstream_t value);
virtual function void set_config_string(string inst_name, string field_name, string value);
virtual function void set_config_object(string inst_name, string field_name,
                                        uvm_object value, bit clone = 1);

virtual function bit get_config_int   (string field_name, inout uvm_bitstream_t value);
virtual function bit get_config_string(string field_name, inout string value);
virtual function bit get_config_object(string field_name, inout uvm_object value, input bit clone = 1);
```

**What each one maps to**

| Legacy call | Equivalent |
| --- | --- |
| `set_config_int("env.wr_agt", "is_active", UVM_PASSIVE)` | `uvm_config_db #(uvm_bitstream_t)::set(this, "env.wr_agt", "is_active", UVM_PASSIVE)` |
| `set_config_string("env", "mode", "stress")` | `uvm_config_db #(string)::set(this, "env", "mode", "stress")` |
| `set_config_object("env", "cfg", cfg, 0)` | `uvm_config_db #(uvm_object)::set(this, "env", "cfg", cfg)` |
| `get_config_int("depth", depth)` | `uvm_config_db #(uvm_bitstream_t)::get(this, "", "depth", depth)` |

**Example**

```systemverilog
// Old style
function void build_phase(uvm_phase phase);
    set_config_int("env.wr_agt", "is_active", UVM_PASSIVE);
    set_config_object("env", "cfg", cfg, 0);
    super.build_phase(phase);
endfunction

// New style
function void build_phase(uvm_phase phase);
    uvm_config_db #(uvm_bitstream_t)::set(this, "env.wr_agt", "is_active", UVM_PASSIVE);
    uvm_config_db #(fifo_cfg)::set(this, "env", "cfg", cfg);
    super.build_phase(phase);
endfunction
```

**Things that catch people out**

- **Types.** The integer forms store and look up `uvm_bitstream_t`. A value written with `set_config_int` is not found by `uvm_config_db #(int)::get`, and the reverse. This is also why `uvm_agent` in UVM 1.1d, which reads `is_active` with `get_config_int`, ignores a value set as `#(uvm_active_passive_enum)`.
- **Objects.** `set_config_object` clones the object by default (`clone = 1`), so the receiver gets a copy and later changes to the original are not seen. Pass 0 to share the handle. It also stores the value as plain `uvm_object`, so a `uvm_config_db #(fifo_cfg)::get` does not find it; the receiver must use `#(uvm_object)` and `$cast`.
- **Automatic application.** Values set this way are applied to fields registered with `` `uvm_field_* `` macros during `super.build_phase`, through `apply_config_settings`.

**See also**: `uvm_config_db`, `uvm_set_config_int`, `is_active`, `uvm_agent`, `apply_config_settings`, `print_config`
