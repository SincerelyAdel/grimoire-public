**`uvm_top`** — global handle to the single `uvm_root` instance

A package-level constant in `uvm_pkg` that points to the top of the component hierarchy. Any code can use it to reach hierarchy-wide services without holding a component handle.

**Declaration**

```systemverilog
const uvm_root uvm_top = uvm_root::get();
```

**Common uses**

```systemverilog
uvm_top.print_topology();                         // dump the component tree
uvm_top.set_timeout(5ms);                         // global watchdog
uvm_top.set_report_verbosity_level_hier(UVM_HIGH);

uvm_component c = uvm_top.find("*.wr_agt.drv");   // search by path

// From a module, where there is no component context:
initial begin
    uvm_config_db #(virtual fifo_if)::set(uvm_top, "uvm_test_top.env*", "vif", fifo_vif);
    run_test();
end
```

**Notes**

- Passing `null` as the context to `uvm_config_db` means the same thing as passing `uvm_top` and is the more common spelling.
- `uvm_top` is not `uvm_test_top`. `uvm_top` is the invisible root with an empty name; `uvm_test_top` is the name of the test instance one level below it.
- IEEE 1800.2 deprecates the variable; `uvm_root::get()` works in every version.

**See also**: `uvm_root`, `uvm_test_top`, `print_topology`, `run_test`
