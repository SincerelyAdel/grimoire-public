**`uvm_callback`** — base class for user-defined callback objects

A callback class declares a set of virtual hook methods. A component calls those hooks at chosen points with `` `uvm_do_callbacks ``, and tests attach callback objects to change behaviour for one test without subclassing the component or using the factory. All callback classes extend `uvm_callback`.

**Declaration**

```systemverilog
class uvm_callback extends uvm_object;
    function new(string name = "uvm_callback");
    function bit callback_mode(int on = -1);     // enable, disable or query
    function bit is_enabled();
```

**The three pieces**

```systemverilog
// 1. The callback interface: empty virtual hooks
virtual class fifo_wr_driver_cb extends uvm_callback;
    function new(string name = "fifo_wr_driver_cb");
        super.new(name);
    endfunction
    virtual task pre_drive (fifo_wr_driver drv, fifo_transaction tr); endtask
    virtual task post_drive(fifo_wr_driver drv, fifo_transaction tr); endtask
endclass

// 2. The component: registers the pairing and calls the hooks
class fifo_wr_driver extends uvm_driver #(fifo_transaction);
    `uvm_component_utils(fifo_wr_driver)
    `uvm_register_cb(fifo_wr_driver, fifo_wr_driver_cb)

    task drive_item(fifo_transaction tr);
        `uvm_do_callbacks(fifo_wr_driver, fifo_wr_driver_cb, pre_drive(this, tr))
        // ... drive ...
        `uvm_do_callbacks(fifo_wr_driver, fifo_wr_driver_cb, post_drive(this, tr))
    endtask
endclass

// 3. A test-specific callback, attached to an instance
class stretch_cb extends fifo_wr_driver_cb;
    `uvm_object_utils(stretch_cb)
    function new(string name = "stretch_cb");
        super.new(name);
    endfunction
    virtual task pre_drive(fifo_wr_driver drv, fifo_transaction tr);
        tr.delay += 3;
    endtask
endclass

stretch_cb cb = stretch_cb::type_id::create("cb");
uvm_callbacks #(fifo_wr_driver, fifo_wr_driver_cb)::add(env.wr_agt.drv, cb);
```

**Notes**

- `cb.callback_mode(0)` disables a callback without removing it.
- Callbacks compose: several can be attached to one instance and run in order.
- The library uses the same mechanism for `uvm_report_catcher`, `uvm_objection_callback`, `uvm_event_callback` and the register layer's `uvm_reg_cbs`.

**See also**: `uvm_callbacks`, `uvm_register_cb`, `uvm_do_callbacks`, `uvm_report_catcher`, `uvm_factory`
