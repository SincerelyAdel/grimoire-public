**`` `uvm_object_param_utils ``** — factory registration for a parameterized object

Use instead of `` `uvm_object_utils `` when the transaction, sequence or configuration class has parameters. Each specialization is registered by type only.

**Syntax**

```systemverilog
`uvm_object_param_utils(TYPE #(PARAMS))
```

The block form is `` `uvm_object_param_utils_begin(TYPE #(PARAMS)) `` ... `` `uvm_object_utils_end ``.

**Example**

```systemverilog
class fifo_transaction #(int DATA_W = 8) extends uvm_sequence_item;
    `uvm_object_param_utils(fifo_transaction #(DATA_W))

    rand logic [DATA_W-1:0] data;

    function new(string name = "fifo_transaction");
        super.new(name);
    endfunction

    virtual function string get_type_name();
        return $sformatf("fifo_transaction #(%0d)", DATA_W);
    endfunction
endclass

typedef fifo_transaction #(32) fifo32_transaction;
fifo32_transaction tr = fifo32_transaction::type_id::create("tr");
```

**Notes**

- `get_type_name()` is not generated; override it as shown if you want readable print and report output.
- Name-based factory overrides cannot target a parameterized class. Use `set_type_override_by_type` with `get_type()`.
- A `typedef` for each specialization keeps `type_id::create` calls readable.

**See also**: `uvm_object_utils`, `uvm_component_param_utils`, `type_id`
