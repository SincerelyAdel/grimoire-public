**`type_id`** — a class's factory proxy, used to create instances and set overrides

Every class registered with `` `uvm_component_utils `` or `` `uvm_object_utils `` gets a nested type named `type_id`. It is a typedef of `uvm_component_registry` or `uvm_object_registry`, and it is the handle through which you ask the factory to build that class. `T::type_id::create(...)` is the UVM replacement for `new`.

**Methods**

```systemverilog
// components
static function T create(string name, uvm_component parent, string contxt = "");

// objects
static function T create(string name = "", uvm_component parent = null, string contxt = "");

static function this_type get();
static function void set_type_override(uvm_object_wrapper override_type, bit replace = 1);
static function void set_inst_override(uvm_object_wrapper override_type,
                                       string inst_path, uvm_component parent = null);
```

| Method | Purpose |
| --- | --- |
| `create` | Ask the factory for an instance. Returns the requested type, already cast, or whatever type overrides it. |
| `get` | The singleton proxy; the same thing `T::get_type()` returns. |
| `set_type_override` | Replace this type everywhere. |
| `set_inst_override` | Replace it only at `inst_path`, relative to `parent`. |

**Example**

```systemverilog
function void build_phase(uvm_phase phase);
    super.build_phase(phase);
    mon = fifo_wr_monitor::type_id::create("mon", this);      // component: name and parent
    if (is_active == UVM_ACTIVE) begin
        sqr = fifo_sequencer::type_id::create("sqr", this);
        drv = fifo_wr_driver::type_id::create("drv", this);
    end
endfunction

task body();
    req = fifo_transaction::type_id::create("req");           // object: name only
    start_item(req);
    void'(req.randomize());
    finish_item(req);
endtask

// In a test, before the environment is built:
fifo_transaction::type_id::set_type_override(fifo_err_transaction::get_type());
fifo_wr_driver::type_id::set_inst_override(fifo_slow_wr_driver::get_type(), "env.wr_agt.drv", this);
```

**Notes**

- The instance name passed to `create` should match the variable name, so hierarchical paths match the code.
- For a component, always pass `this` as the parent.
- For an object, pass a component as the second argument only if instance overrides should apply to it; inside a sequence, `create("req", , get_full_name())` supplies the context string instead.
- Using `new()` instead of `create()` compiles and runs, but the factory is bypassed and overrides have no effect on that object.
- If `create` returns the wrong type, the override class does not extend the requested class and UVM reports a fatal cast error.

**See also**: `uvm_factory`, `uvm_component_utils`, `uvm_object_utils`, `set_type_override`, `set_inst_override`, `uvm_object_wrapper`
