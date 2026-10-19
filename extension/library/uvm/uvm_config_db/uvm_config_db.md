**`uvm_config_db`** — the typed configuration database

The standard way to pass configuration down the component hierarchy without hard-wired handles. A higher-level component, or the testbench module, stores a value under a name and a hierarchical scope; a lower-level component looks it up by name during `build_phase`. It carries virtual interfaces, configuration objects, simple knobs and default sequences.

**Declaration**

```systemverilog
class uvm_config_db #(type T = int) extends uvm_resource_db #(T);

    static function void set(uvm_component cntxt, string inst_name,
                             string field_name, T value);

    static function bit get(uvm_component cntxt, string inst_name,
                            string field_name, inout T value);

    static function bit exists(uvm_component cntxt, string inst_name,
                               string field_name, bit spell_chk = 0);

    static task wait_modified(uvm_component cntxt, string inst_name,
                              string field_name);
```

| Argument | Meaning |
| --- | --- |
| `cntxt` | The component the path is relative to. `null` means the top (`uvm_top`). |
| `inst_name` | Path below `cntxt`, with `*` and `?` wildcards. The full scope is `{cntxt.get_full_name(), ".", inst_name}`. |
| `field_name` | The key. A plain string; it does not have to match a variable name. |
| `value` | The value to store, or the variable that receives it. |

**Example: virtual interface from the testbench top**

```systemverilog
module tb_fifo;
    fifo_if fifo_vif (.clk(clk), .rst_n(rst_n));

    initial begin
        uvm_config_db #(virtual fifo_if.wr_driver)::set(null, "uvm_test_top.env.wr_agt.drv", "vif", fifo_vif);
        uvm_config_db #(virtual fifo_if.wr_monitor)::set(null, "uvm_test_top.env.wr_agt.mon", "vif", fifo_vif);
        run_test();
    end
endmodule

class fifo_wr_driver extends uvm_driver #(fifo_transaction);
    virtual fifo_if.wr_driver vif;

    function void build_phase(uvm_phase phase);
        super.build_phase(phase);
        if (!uvm_config_db #(virtual fifo_if.wr_driver)::get(this, "", "vif", vif))
            `uvm_fatal("FIFO_WR_DRV", "No virtual interface set for fifo_wr_driver.vif")
    endfunction
endclass
```

**Example: configuration object from the test**

```systemverilog
function void build_phase(uvm_phase phase);       // in the test
    fifo_cfg cfg = fifo_cfg::type_id::create("cfg");
    cfg.depth = 64;
    uvm_config_db #(fifo_cfg)::set(this, "env*", "cfg", cfg);
    env = fifo_env::type_id::create("env", this);
endfunction
```

**Precedence**

- During `build_phase`, a `set` from higher in the hierarchy wins over one from lower down. This is what lets a test override an environment's defaults.
- At the same level, and always after build, the last `set` wins.

**The type must match exactly**

`T` is part of the key. A value stored with `#(virtual fifo_if)` is not found by a `get` with `#(virtual fifo_if.wr_driver)`, and an `int` is not found as `int unsigned`. This is the most common reason for a `get` that returns 0.

**Notes**

- Always check the return value of `get()`.
- `set()` before the consumer builds: in the test, set values before creating the environment.
- Values are stored by copy for simple types and by handle for objects; changing the object later changes what everyone sees.
- Keep wildcards narrow. `"*"` matches everything and makes debugging harder.
- `wait_modified` lets run-time code react to a later `set`, for dynamic reconfiguration.
- Debug with `+UVM_CONFIG_DB_TRACE`, or call `print_config(1)` on a component, or `check_config_usage()` to find values that were set but never read.

**See also**: `uvm_resource_db`, `build_phase`, `uvm_top`, `uvm_test_top`, `wait_modified`, `UVM_CONFIG_DB_TRACE`, `set_config_int`
