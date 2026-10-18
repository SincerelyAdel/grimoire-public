**`create_component`** — create a component or object through the factory by type name (`create_component`, `create_object`)

Two `uvm_component` methods that ask the factory for an instance using the type name as a string. They apply factory overrides in the same way as `type_id::create()`. They are useful when the type is only known at run time, for example chosen from a plusarg or a configuration string.

**Signatures**

```systemverilog
function uvm_component create_component(string requested_type_name, string name);
function uvm_object    create_object   (string requested_type_name, string name = "");
```

The new component's parent is the component on which the method is called. Both return a base-class handle that must be cast.

**Example**

```systemverilog
class fifo_env extends uvm_env;
    `uvm_component_utils(fifo_env)

    uvm_scoreboard scb;
    string         scb_type = "fifo_scoreboard";

    function void build_phase(uvm_phase phase);
        uvm_component c;
        super.build_phase(phase);

        void'(uvm_config_db #(string)::get(this, "", "scb_type", scb_type));

        c = create_component(scb_type, "scb");
        if (c == null || !$cast(scb, c))
            `uvm_fatal("FIFO_ENV", {"cannot create a scoreboard of type ", scb_type})
    endfunction
endclass

// Selecting a sequence by name
uvm_object        obj = create_object(seq_name, "seq");
uvm_sequence_base seq;
if (!$cast(seq, obj)) `uvm_fatal("TEST", {"not a sequence: ", seq_name})
```

**The equivalent factory calls**

```systemverilog
uvm_factory f = uvm_factory::get();
c   = f.create_component_by_name(scb_type, get_full_name(), "scb", this);
obj = f.create_object_by_name(seq_name, get_full_name(), "seq");
```

**Notes**

- The name must match the string registered by `` `uvm_component_utils `` or `` `uvm_object_utils ``. An unknown name returns null and reports a warning.
- When the type is known at compile time, `T::type_id::create()` is safer: it is type-checked and returns the right type without a cast.
- Parameterized classes registered with `_param_utils` have no name and cannot be created this way.

**See also**: `type_id`, `uvm_factory`, `set_type_override`, `uvm_component`, `build_phase`
