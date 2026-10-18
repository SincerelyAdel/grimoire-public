**`wait_modified`** — block until a configuration database entry is set

A static task of `uvm_config_db`. It waits until a `set()` is made for the given context, instance path and field name, then returns. It lets run-time code react to configuration that changes during the simulation, instead of reading a value once in `build_phase`.

**Signature**

```systemverilog
static task wait_modified(uvm_component cntxt, string inst_name, string field_name);
```

The arguments identify the entry in the same way as for `uvm_config_db::get()`.

**Example**

```systemverilog
// Driver: follow a rate setting that the test may change at any time
task run_phase(uvm_phase phase);
    fork
        forever begin
            uvm_config_db #(int)::wait_modified(this, "", "max_delay");
            void'(uvm_config_db #(int)::get(this, "", "max_delay", max_delay));
            `uvm_info("FIFO_WR_DRV", $sformatf("max_delay is now %0d", max_delay), UVM_MEDIUM)
        end
    join_none

    forever begin
        seq_item_port.get_next_item(req);
        drive_item(req);
        seq_item_port.item_done();
    end
endtask

// Test: change it mid-run
task run_phase(uvm_phase phase);
    phase.raise_objection(this);
    #1us;
    uvm_config_db #(int)::set(this, "env.wr_agt.drv", "max_delay", 0);
    #1us;
    phase.drop_objection(this);
endtask
```

**Notes**

- It reports that a matching `set()` happened, not the value. Call `get()` afterwards.
- It only sees `set()` calls made after the wait began. Read the initial value with `get()` first.
- The type parameter of the class used for `wait_modified` does not have to match the one used for `set`; matching is by scope and field name.
- For values that change often and are consumed by one component, a direct handle to a shared configuration object, or a `uvm_event`, is simpler.

**See also**: `uvm_config_db`, `uvm_event`, `run_phase`
