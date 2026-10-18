**`` `uvm_component_param_utils ``** — factory registration for a parameterized component

Use instead of `` `uvm_component_utils `` when the class has parameters. It registers each specialization with the factory by type only, not by name, because a single string name cannot identify every parameter combination.

**Syntax**

```systemverilog
`uvm_component_param_utils(TYPE #(PARAMS))
```

The block form is `` `uvm_component_param_utils_begin(TYPE #(PARAMS)) `` ... `` `uvm_component_utils_end ``.

**Example**

```systemverilog
class fifo_monitor #(int DATA_W = 8) extends uvm_monitor;
    `uvm_component_param_utils(fifo_monitor #(DATA_W))

    uvm_analysis_port #(fifo_transaction #(DATA_W)) ap;

    function new(string name = "fifo_monitor", uvm_component parent = null);
        super.new(name, parent);
    endfunction
endclass

fifo_monitor #(16) mon;
mon = fifo_monitor #(16)::type_id::create("mon", this);
```

**Notes**

- `get_type_name()` is not generated. It returns `"<unknown>"` unless you override it yourself, which matters for print output and name-based overrides.
- Only type-based overrides work: `set_type_override_by_type(fifo_monitor #(16)::get_type(), my_monitor #(16)::get_type())`. Name-based overrides and `+uvm_set_type_override` cannot target it.
- Each distinct parameter set is a separate class with a separate `type_id`.

**See also**: `uvm_component_utils`, `uvm_object_param_utils`, `type_id`, `set_type_override`
