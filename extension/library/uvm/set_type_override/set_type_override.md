**`set_type_override`** — replace one type with another everywhere the factory creates it

Tells the factory that whenever the original type is requested, an instance of the override type should be created instead. It is how a test swaps in an error-injecting transaction, a different driver, or a modified sequence, without editing the environment.

**Forms**

```systemverilog
// On the class's factory proxy (most common)
static function void T::type_id::set_type_override(uvm_object_wrapper override_type, bit replace = 1);

// On a component
function void set_type_override_by_type(uvm_object_wrapper original_type,
                                        uvm_object_wrapper override_type, bit replace = 1);
function void set_type_override(string original_type_name,
                                string override_type_name, bit replace = 1);

// On the factory
function void set_type_override_by_type(uvm_object_wrapper original_type,
                                        uvm_object_wrapper override_type, bit replace = 1);
function void set_type_override_by_name(string original_type_name,
                                        string override_type_name, bit replace = 1);
```

| Argument | Meaning |
| --- | --- |
| `original_type` | The type the testbench asks for, as `T::get_type()` |
| `override_type` | The type to create instead; it must extend the original |
| `replace` | 1: replace an existing override of the same original. 0: keep the existing one. |

**Example**

```systemverilog
class fifo_no_delay_transaction extends fifo_transaction;
    `uvm_object_utils(fifo_no_delay_transaction)
    constraint delay_c { delay == 0; }
    function new(string name = "fifo_no_delay_transaction");
        super.new(name);
    endfunction
endclass

class fifo_b2b_test extends fifo_test;
    `uvm_component_utils(fifo_b2b_test)

    function new(string name = "fifo_b2b_test", uvm_component parent = null);
        super.new(name, parent);
    endfunction

    function void build_phase(uvm_phase phase);
        // three equivalent ways
        fifo_transaction::type_id::set_type_override(fifo_no_delay_transaction::get_type());
        // set_type_override_by_type(fifo_transaction::get_type(), fifo_no_delay_transaction::get_type());
        // set_type_override("fifo_transaction", "fifo_no_delay_transaction");

        super.build_phase(phase);
    endfunction
endclass
```

**Rules**

- Set the override before the objects are created. For components, that means before the parent's `build_phase` runs `create()`. For transactions and sequences, any time before they are created.
- It only affects objects built with `type_id::create()` or the factory `create_*` methods.
- The override class must be derived from the original class, or the cast inside `create()` fails with a fatal error.
- An instance override for a specific path takes precedence over a type override.
- Overrides chain: if A is overridden by B and B by C, a request for A creates C.

**Checking it**

```systemverilog
uvm_factory::get().print();          // lists every override
```

**See also**: `set_inst_override`, `uvm_factory`, `type_id`, `uvm_set_type_override`, `uvm_object_utils`, `build_phase`
