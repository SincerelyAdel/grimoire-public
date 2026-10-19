**`` `uvm_component_utils ``** — register a component class with the factory

Placed once inside every class derived from `uvm_component`. It registers the class with the UVM factory under its own name, which is what makes `type_id::create()` and factory overrides work, and it implements `get_type_name()`.

**Syntax**

```systemverilog
`uvm_component_utils(TYPE)
```

| Argument | Meaning |
| --- | --- |
| `TYPE` | The class being declared, with no quotes and no trailing semicolon. |

**What it expands to**

- `typedef uvm_component_registry #(TYPE, "TYPE") type_id;`
- `static function type_id get_type();`
- `virtual function uvm_object_wrapper get_object_type();`
- `const static string type_name = "TYPE";` and `virtual function string get_type_name();`

**Example**

```systemverilog
class fifo_wr_driver extends uvm_driver #(fifo_transaction);
    `uvm_component_utils(fifo_wr_driver)

    function new(string name = "fifo_wr_driver", uvm_component parent = null);
        super.new(name, parent);
    endfunction
endclass

// Elsewhere, always build through the factory:
drv = fifo_wr_driver::type_id::create("drv", this);
```

**Notes**

- The constructor must have exactly the signature `(string name, uvm_component parent)`; the factory calls it with those two arguments.
- Use `` `uvm_component_param_utils `` for a parameterized class, otherwise every specialization fights over one type name.
- Use `` `uvm_component_utils_begin `` / `` `uvm_component_utils_end `` when you also want field automation macros.
- Forgetting this macro compiles, but `type_id` does not exist, so `create()` fails to compile where the class is used.
- Never construct a registered component with `new()` directly; overrides are then silently ignored.

**See also**: `uvm_object_utils`, `uvm_component_param_utils`, `type_id`, `uvm_factory`, `set_type_override`
