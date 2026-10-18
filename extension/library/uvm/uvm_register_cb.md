**`` `uvm_register_cb ``** — declare that a class accepts a given callback type

Used inside a component or object that offers callback hooks. It registers the pairing of the class with a callback class, so that the library can type-check `uvm_callbacks #(T, CB)::add()` calls and report mistakes instead of silently ignoring them.

**Syntax**

```systemverilog
`uvm_register_cb(T, CB)
```

| Argument | Meaning |
| --- | --- |
| `T` | The class that calls the callbacks. |
| `CB` | The callback base class, derived from `uvm_callback`. |

**Example**

```systemverilog
virtual class fifo_wr_driver_cb extends uvm_callback;
    function new(string name = "fifo_wr_driver_cb");
        super.new(name);
    endfunction
    virtual task pre_drive(fifo_wr_driver drv, fifo_transaction tr);
    endtask
endclass

class fifo_wr_driver extends uvm_driver #(fifo_transaction);
    `uvm_component_utils(fifo_wr_driver)
    `uvm_register_cb(fifo_wr_driver, fifo_wr_driver_cb)

    task drive_item(fifo_transaction tr);
        `uvm_do_callbacks(fifo_wr_driver, fifo_wr_driver_cb, pre_drive(this, tr))
        // drive the pins
    endtask
endclass
```

**Notes**

- Without the registration, adding a callback still works but produces a warning that the pair is not registered.
- Registration is inherited: callbacks registered on a base class apply to derived classes if the derived class uses `` `uvm_set_super_type ``.

**See also**: `uvm_do_callbacks`, `uvm_callback`, `uvm_callbacks`
