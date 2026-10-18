**`uvm_callbacks`** — the registry that attaches callback objects to instances

A parameterized static class that stores which callback objects are attached to which objects. Use it to add and remove callbacks; the `` `uvm_do_callbacks `` macro uses it to find the ones to call.

**Declaration**

```systemverilog
class uvm_callbacks #(type T = uvm_object, type CB = uvm_callback)
    extends uvm_typed_callbacks #(T);

    static function void add(T obj, uvm_callback cb, uvm_apprepend ordering = UVM_APPEND);
    static function void add_by_name(string name, uvm_callback cb, uvm_component root,
                                     uvm_apprepend ordering = UVM_APPEND);
    static function void delete(T obj, uvm_callback cb);
    static function void delete_by_name(string name, uvm_callback cb, uvm_component root);
    static function void display(T obj = null);
```

| Parameter | Meaning |
| --- | --- |
| `T` | The class that issues the callbacks. |
| `CB` | The callback base class. |

**Example**

```systemverilog
typedef uvm_callbacks #(fifo_wr_driver, fifo_wr_driver_cb) fifo_wr_driver_cbs;

function void start_of_simulation_phase(uvm_phase phase);
    stretch_cb cb = stretch_cb::type_id::create("cb");

    fifo_wr_driver_cbs::add(env.wr_agt.drv, cb);              // one instance
    // fifo_wr_driver_cbs::add(null, cb);                     // every fifo_wr_driver
    // fifo_wr_driver_cbs::add_by_name("*.wr_agt.drv", cb, this);
    fifo_wr_driver_cbs::display();
endfunction
```

**Notes**

- `obj == null` makes it a type-wide callback, applied to every instance of `T`.
- `UVM_PREPEND` runs the new callback before those already attached.
- The pair `(T, CB)` should be declared with `` `uvm_register_cb `` in `T`, otherwise `add` warns that the callback type is not registered.
- Iterating by hand is possible with `uvm_callback_iter #(T, CB)`, which is what the macro does internally.

**See also**: `uvm_callback`, `uvm_register_cb`, `uvm_do_callbacks`, `uvm_report_catcher`
