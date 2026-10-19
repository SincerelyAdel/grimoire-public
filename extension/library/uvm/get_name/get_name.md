**`get_name`** — the instance name of an object

A virtual function of `uvm_object`. It returns the name given to the object when it was constructed: the first argument of `new()` or of `type_id::create()`. For a component this is the leaf name, the last part of its hierarchical path.

**Signatures**

```systemverilog
virtual function string get_name();
virtual function void   set_name(string name);
```

**Example**

```systemverilog
drv = fifo_wr_driver::type_id::create("drv", this);

drv.get_name()        // "drv"
drv.get_full_name()   // "uvm_test_top.env.wr_agt.drv"
drv.get_type_name()   // "fifo_wr_driver"

// Naming objects helps when reading sequence and transaction logs
req = fifo_transaction::type_id::create($sformatf("req_%0d", i));

// A phase's name
if (phase.get_name() == "run") ...
```

**The three names**

| Function | Returns | Example |
| --- | --- | --- |
| `get_name()` | Instance name | `drv` |
| `get_full_name()` | Hierarchical path | `uvm_test_top.env.wr_agt.drv` |
| `get_type_name()` | Class name registered with the factory | `fifo_wr_driver` |

**Notes**

- A component's name cannot be changed after construction; `set_name()` on a component with a parent is reported as an error.
- Two children of the same parent must not share a name.
- Give the instance the same name as the variable that holds it. Mismatches make configuration scopes and log paths misleading.

**See also**: `get_full_name`, `get_type_name`, `get_parent`, `uvm_object`, `type_id`
