**`+uvm_set_config_int`** — command-line configuration settings (`+uvm_set_config_int`, `+uvm_set_config_string`)

Two plusargs that put a value into the configuration database from the command line. They behave like a `set` call made from the top of the hierarchy, so a regression can change knobs such as item counts or modes without a new test.

**Syntax**

```
+uvm_set_config_int=<comp>,<field>,<value>
+uvm_set_config_string=<comp>,<field>,<value>
```

| Field | Meaning |
| --- | --- |
| `comp` | Full path of the component that will read the value, with wildcards |
| `field` | The field name used in the `get` call |
| `value` | An integer (decimal, or with a radix prefix `'h`, `'d`, `'b`, `'o`), or a string |

**Example**

```
xrun -R +UVM_TESTNAME=fifo_test \
     +uvm_set_config_int=uvm_test_top.env,depth,64 \
     +uvm_set_config_int=uvm_test_top.env.wr_agt,is_active,0 \
     +uvm_set_config_string=uvm_test_top,mode,stress
```

Reading the values:

```systemverilog
function void build_phase(uvm_phase phase);
    uvm_bitstream_t depth_cfg;
    string          mode;

    super.build_phase(phase);
    if (uvm_config_db #(uvm_bitstream_t)::get(this, "", "depth", depth_cfg))
        depth = depth_cfg;
    void'(uvm_config_db #(string)::get(this, "", "mode", mode));
endfunction
```

**The type matters**

The integer form stores the value as `uvm_bitstream_t`. A `get` must use `uvm_config_db #(uvm_bitstream_t)`, or the field must be registered with `` `uvm_field_int `` so that `super.build_phase` applies it. A `get` with `#(int)` does not find it. The string form is read with `#(string)`.

**Notes**

- Being set from the top, these values take precedence over settings made lower in the hierarchy during build.
- There is no plusarg for object or virtual interface values.
- For plain test knobs that are not hierarchical, `$value$plusargs` or `uvm_cmdline_processor` is often simpler.

**See also**: `uvm_config_db`, `set_config_int`, `uvm_cmdline_processor`, `uvm_set_verbosity`, `uvm_set_type_override`
