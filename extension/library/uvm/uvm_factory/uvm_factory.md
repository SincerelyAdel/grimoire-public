**`uvm_factory`** — the central registry that creates objects and applies type overrides

The factory is what makes a UVM testbench reconfigurable without editing it. Classes register themselves with it (through the `` `uvm_*_utils `` macros), code asks it to create instances (through `type_id::create()`), and a test tells it to substitute one type for another. Substitution then happens everywhere the original type is requested.

**Getting the handle**

```systemverilog
uvm_factory factory = uvm_factory::get();                           // UVM 1.1 and 1.2
uvm_factory factory = uvm_coreservice_t::get().get_factory();       // UVM 1.2 and IEEE
```

In UVM 1.1 a global variable named `factory` also exists.

**Main methods**

| Method | Purpose |
| --- | --- |
| `set_type_override_by_type(original, override, bit replace = 1)` | Replace every instance of a type |
| `set_inst_override_by_type(original, override, string full_inst_path)` | Replace only instances whose path matches |
| `set_type_override_by_name(original_name, override_name, bit replace = 1)` | Same, by type-name string |
| `set_inst_override_by_name(original_name, override_name, full_inst_path)` | Same, by name |
| `create_object_by_type` / `create_component_by_type` | Create from a type proxy |
| `create_object_by_name` / `create_component_by_name` | Create from a type-name string |
| `find_override_by_type(requested, full_inst_path)` | Which type would actually be created |
| `debug_create_by_type` / `debug_create_by_name` | Explain how an override was resolved |
| `print(int all_types = 1)` | Print registered types and overrides |

**Example**

```systemverilog
class fifo_err_transaction extends fifo_transaction;
    `uvm_object_utils(fifo_err_transaction)
    constraint delay_c { delay == 0; }           // replaces the base constraint
    function new(string name = "fifo_err_transaction");
        super.new(name);
    endfunction
endclass

class fifo_b2b_test extends fifo_test;
    `uvm_component_utils(fifo_b2b_test)

    function new(string name = "fifo_b2b_test", uvm_component parent = null);
        super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
        // every fifo_transaction created through the factory becomes a fifo_err_transaction
        fifo_transaction::type_id::set_type_override(fifo_err_transaction::get_type());

        // only the write agent's driver is replaced
        fifo_wr_driver::type_id::set_inst_override(fifo_slow_wr_driver::get_type(), "env.wr_agt.drv", this);

        super.build_phase(phase);
    endfunction

    function void end_of_elaboration_phase(uvm_phase phase);
        uvm_factory::get().print();
    endfunction
endclass
```

**Rules**

- The override class must extend the original class.
- Overrides must be set before the affected object is created. For components that means before the parent's `build_phase` creates them.
- An instance override takes precedence over a type override.
- Only objects created with `type_id::create()` (or the factory `create_*` methods) can be overridden. Anything built with `new()` is fixed.
- A later type override replaces an earlier one for the same type when `replace` is 1.

**Command line**

```
+uvm_set_type_override=fifo_transaction,fifo_err_transaction
+uvm_set_inst_override=fifo_wr_driver,fifo_slow_wr_driver,uvm_test_top.env.wr_agt.drv
```

**See also**: `type_id`, `set_type_override`, `set_inst_override`, `uvm_object_utils`, `uvm_component_utils`, `uvm_object_wrapper`, `uvm_coreservice_t`
