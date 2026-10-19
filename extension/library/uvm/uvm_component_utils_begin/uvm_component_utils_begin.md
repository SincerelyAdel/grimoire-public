**`` `uvm_component_utils_begin ``** — factory registration for a component, with field automation

The long form of `` `uvm_component_utils ``. It registers the class with the factory and opens a block in which `` `uvm_field_* `` macros list the configuration fields of the component. The block is closed with `` `uvm_component_utils_end ``.

**Syntax**

```systemverilog
`uvm_component_utils_begin(TYPE)
    `uvm_field_*(FIELD, FLAG)
`uvm_component_utils_end
```

**Why use it on a component**

Fields listed here are set automatically from the configuration database during `super.build_phase(phase)`: `uvm_component::build_phase` calls `apply_config_settings()`, which looks up each registered field by name. That is the only reason to prefer it over the short macro, since components are rarely copied, compared or packed.

**Example**

```systemverilog
class fifo_env extends uvm_env;
    int unsigned depth = 16;
    uvm_active_passive_enum wr_active = UVM_ACTIVE;

    `uvm_component_utils_begin(fifo_env)
        `uvm_field_int(depth, UVM_DEFAULT)
        `uvm_field_enum(uvm_active_passive_enum, wr_active, UVM_DEFAULT)
    `uvm_component_utils_end

    function new(string name = "fifo_env", uvm_component parent = null);
        super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);   // depth and wr_active are filled in here
    endfunction
endclass

// In the test:
uvm_config_db #(int)::set(this, "env", "depth", 64);
```

**Notes**

- Automatic configuration only happens if `super.build_phase(phase)` is called.
- It matches by field name, and the type stored in the database must match: an `int` field needs `uvm_config_db #(int)` or `#(uvm_bitstream_t)`.
- Many teams avoid field automation for performance and clarity and use an explicit `uvm_config_db::get()` instead.

**See also**: `uvm_component_utils`, `uvm_field_int`, `uvm_config_db`, `build_phase`
