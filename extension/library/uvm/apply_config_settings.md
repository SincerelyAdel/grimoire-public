**`apply_config_settings`** — automatic configuration of a component's registered fields

A `uvm_component` method called by `uvm_component::build_phase`. For every field the component registered with a `` `uvm_field_* `` macro, it looks in the configuration database for an entry with the same name that is visible to this component, and assigns it. This is what makes a `` `uvm_field_int(depth, UVM_DEFAULT) `` field configurable with no explicit `get` call.

**Signature**

```systemverilog
virtual function void apply_config_settings(bit verbose = 0);
```

**Example**

```systemverilog
class fifo_env extends uvm_env;
    int unsigned depth    = 16;
    string       mode     = "normal";
    fifo_cfg     cfg;

    `uvm_component_utils_begin(fifo_env)
        `uvm_field_int   (depth, UVM_DEFAULT)
        `uvm_field_string(mode,  UVM_DEFAULT)
        `uvm_field_object(cfg,   UVM_DEFAULT | UVM_REFERENCE)
    `uvm_component_utils_end

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);      // calls apply_config_settings(): depth, mode, cfg are now set
        `uvm_info("FIFO_ENV", $sformatf("depth=%0d mode=%s", depth, mode), UVM_LOW)
    endfunction
endclass

// Test
uvm_config_db #(uvm_bitstream_t)::set(this, "env", "depth", 64);
uvm_config_db #(string)::set(this, "env", "mode", "stress");
uvm_config_db #(uvm_object)::set(this, "env", "cfg", cfg);
```

**Matching rules**

| Field macro | Type the database entry must have |
| --- | --- |
| `` `uvm_field_int ``, `` `uvm_field_enum `` | `uvm_bitstream_t` in UVM 1.1d; UVM 1.2 also accepts `int`, `int unsigned`, `uvm_integral_t` |
| `` `uvm_field_string `` | `string` |
| `` `uvm_field_object `` | `uvm_object` |

**Notes**

- Nothing happens unless `super.build_phase(phase)` is called.
- It runs through every resource visible to the component, which is slow in large testbenches. A component with no field macros can skip it by not calling `super.build_phase`, or by overriding this method to do nothing.
- A field flagged `UVM_READONLY` is not written.
- Pass `verbose = 1`, or add `+UVM_CONFIG_DB_TRACE`, to see what was applied.
- Explicit `uvm_config_db::get()` calls are the more common style today: they are faster and fail visibly.

**See also**: `uvm_component_utils_begin`, `uvm_field_int`, `build_phase`, `uvm_config_db`, `set_config_int`, `print_config`
