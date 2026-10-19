**`` `uvm_object_utils ``** — register a data or sequence class with the factory

Placed once inside every class derived from `uvm_object` that is not a component: transactions, sequences and configuration objects. It registers the class with the factory, and implements `create()` and `get_type_name()`.

**Syntax**

```systemverilog
`uvm_object_utils(TYPE)
```

**What it expands to**

- `typedef uvm_object_registry #(TYPE, "TYPE") type_id;`
- `static function type_id get_type();`
- `virtual function uvm_object_wrapper get_object_type();`
- `virtual function uvm_object create(string name = "");`, which `clone()` relies on
- `const static string type_name = "TYPE";` and `virtual function string get_type_name();`

**Example**

```systemverilog
class fifo_transaction extends uvm_sequence_item;
    `uvm_object_utils(fifo_transaction)

    rand logic [7:0]  data;
    rand int unsigned delay;

    constraint delay_c { delay inside {[0:4]}; }

    function new(string name = "fifo_transaction");
        super.new(name);
    endfunction
endclass

fifo_transaction tr = fifo_transaction::type_id::create("tr");
```

**Notes**

- The constructor takes a single `string name` argument with a default value. A missing default breaks `create()`.
- Objects have no parent, so `type_id::create("tr")` takes just a name. Pass a context as the second argument only when instance overrides must apply.
- Use `` `uvm_object_param_utils `` for parameterized classes.
- Use `` `uvm_object_utils_begin `` / `` `uvm_object_utils_end `` to add field automation, or implement `do_copy`, `do_compare` and `convert2string` by hand.

**See also**: `uvm_component_utils`, `uvm_object_utils_begin`, `uvm_object`, `type_id`, `clone`
