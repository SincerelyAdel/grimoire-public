**`` `uvm_do_callbacks ``** — call a hook method on every registered callback

Placed at the point in a component where users may inject behaviour. It walks the callbacks registered for this object, in order, and calls the given method on each enabled one.

**Syntax and family**

```systemverilog
`uvm_do_callbacks(T, CB, METHOD)
`uvm_do_obj_callbacks(T, CB, OBJ, METHOD)
`uvm_do_callbacks_exit_on(T, CB, METHOD, VAL)
`uvm_do_obj_callbacks_exit_on(T, CB, OBJ, METHOD, VAL)
```

| Argument | Meaning |
| --- | --- |
| `T` | The class issuing the callbacks. |
| `CB` | The callback class. |
| `METHOD` | The call to make, with its arguments, for example `pre_drive(this, tr)`. |
| `OBJ` | The object whose callback queue is used, when it is not `this`. |
| `VAL` | For the `_exit_on` forms: stop and return as soon as a callback returns this value. |

**Example**

```systemverilog
task drive_item(fifo_transaction tr);
    `uvm_do_callbacks(fifo_wr_driver, fifo_wr_driver_cb, pre_drive(this, tr))
    vif.wr_drv_cb.data_in <= tr.data;
    vif.wr_drv_cb.wr_en   <= 1'b1;
    @(vif.wr_drv_cb);
    vif.wr_drv_cb.wr_en   <= 1'b0;
endtask

// A test injects an error without touching the driver:
class corrupt_data_cb extends fifo_wr_driver_cb;
    `uvm_object_utils(corrupt_data_cb)
    function new(string name = "corrupt_data_cb");
        super.new(name);
    endfunction
    virtual task pre_drive(fifo_wr_driver drv, fifo_transaction tr);
        tr.data = ~tr.data;
    endtask
endclass

corrupt_data_cb cb = corrupt_data_cb::type_id::create("cb");
uvm_callbacks #(fifo_wr_driver, fifo_wr_driver_cb)::add(env.wr_agt.drv, cb);
```

**Notes**

- The `_exit_on` forms can only be used inside a function that returns a `bit`, because they contain a `return`.
- Callbacks run in the order they were added unless `UVM_PREPEND` was used.
- The factory is the alternative for changing behaviour; callbacks are better when several independent modifications must stack on one instance.

**See also**: `uvm_register_cb`, `uvm_callback`, `uvm_callbacks`
