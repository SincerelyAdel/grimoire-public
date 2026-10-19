**`get_type_name`** — the class name of an object, as a string

A virtual function of `uvm_object` that returns the name of the object's class. The `` `uvm_component_utils `` and `` `uvm_object_utils `` macros implement it for you, returning the string under which the class is registered with the factory.

**Signature**

```systemverilog
virtual function string get_type_name();
```

**Example**

```systemverilog
// Which test is running?
`uvm_info("TEST", {"running ", get_type_name()}, UVM_NONE)

// Did a factory override take effect?
function void end_of_elaboration_phase(uvm_phase phase);
    `uvm_info("TEST", {"write driver is a ", env.wr_agt.drv.get_type_name()}, UVM_LOW)
endfunction

// Generic code that reports what it was given
function void write(uvm_sequence_item t);
    `uvm_info("LOG", $sformatf("%s: %s", t.get_type_name(), t.convert2string()), UVM_HIGH)
endfunction
```

**Notes**

- It returns the actual type of the object, not the type of the handle. A `fifo_transaction` handle that points to a `fifo_err_transaction` returns `"fifo_err_transaction"`.
- Parameterized classes registered with the `_param_utils` macros do not get an implementation and return `"<unknown>"`. Override the function by hand if you want a readable name.
- The base `uvm_object` returns `"<unknown>"` as well.
- For type comparison in code, prefer `$cast` or `get_object_type()` over comparing strings.

**See also**: `get_name`, `get_full_name`, `uvm_object_utils`, `uvm_component_utils`, `uvm_object_param_utils`, `uvm_factory`
