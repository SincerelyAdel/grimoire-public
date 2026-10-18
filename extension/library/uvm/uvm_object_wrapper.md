**`uvm_object_wrapper`** — abstract proxy that represents a class to the factory

The factory does not store classes; it stores lightweight proxy objects, one per registered type, that know how to create an instance of that type. `uvm_object_wrapper` is the common base of those proxies. The concrete ones are `uvm_object_registry #(T, Tname)` and `uvm_component_registry #(T, Tname)`, which the `` `uvm_*_utils `` macros typedef as `type_id` inside each class.

**Declaration**

```systemverilog
virtual class uvm_object_wrapper;
    virtual function uvm_object    create_object(string name = "");
    virtual function uvm_component create_component(string name, uvm_component parent);
    pure virtual function string   get_type_name();
endclass
```

**Where you meet it**

```systemverilog
// 1. As the argument and return type of factory calls
uvm_object_wrapper w = fifo_transaction::get_type();
uvm_factory::get().set_type_override_by_type(fifo_transaction::get_type(),
                                             fifo_err_transaction::get_type());

// 2. As the type of a default sequence in the configuration database
uvm_config_db #(uvm_object_wrapper)::set(this, "env.wr_agt.sqr.main_phase",
                                         "default_sequence", fifo_wr_seq::type_id::get());

// 3. To make a testbench choose a type at run time
function fifo_transaction make_item(uvm_object_wrapper kind);
    uvm_object obj = uvm_factory::get().create_object_by_type(kind, get_full_name(), "item");
    if (!$cast(make_item, obj)) `uvm_fatal("FIFO", "not a fifo_transaction")
endfunction
```

**Notes**

- `T::get_type()` and `T::type_id::get()` return the same singleton proxy.
- You never construct or extend a wrapper yourself.

**See also**: `type_id`, `uvm_factory`, `uvm_object_utils`, `uvm_component_utils`
