**`+uvm_set_type_override`** — command-line factory overrides (`+uvm_set_type_override`, `+uvm_set_inst_override`)

Two plusargs that tell the factory to substitute one registered type for another, exactly like the `set_type_override` and `set_inst_override` calls, but from the command line. A regression can swap a transaction, driver or sequence for a variant without a new test class.

**Syntax**

```
+uvm_set_type_override=<requested type>,<override type>[,<replace>]
+uvm_set_inst_override=<requested type>,<override type>,<full instance path>
```

| Field | Meaning |
| --- | --- |
| `requested type` | The type name the testbench asks the factory for |
| `override type` | The type name to create instead; it must extend the requested type |
| `replace` | 1 (default) to replace an existing override for the same type, 0 to keep it |
| `full instance path` | Component path the override applies to, with wildcards |

**Examples**

```
# Every fifo_transaction becomes a fifo_err_transaction
+uvm_set_type_override=fifo_transaction,fifo_err_transaction

# Only the write agent's driver is replaced
+uvm_set_inst_override=fifo_wr_driver,fifo_slow_wr_driver,uvm_test_top.env.wr_agt.drv

# Different transaction for sequences started directly on the read sequencer only
+uvm_set_inst_override=fifo_transaction,fifo_no_delay_transaction,uvm_test_top.env.rd_agt.sqr.*
```

**Notes**

- The names are the strings registered by `` `uvm_object_utils `` and `` `uvm_component_utils ``. Parameterized classes registered with the `_param_utils` macros have no name and cannot be targeted.
- The override class must be compiled into the simulation, even though nothing in the testbench refers to it.
- The overrides are applied by `run_test()` before the test is built, so they affect the whole hierarchy, and are overridden in turn by later `set_*_override` calls in the test only when `replace` semantics allow.
- Print the result with `uvm_factory::get().print()` in `end_of_elaboration_phase` to confirm the override took effect.

**See also**: `uvm_factory`, `set_type_override`, `set_inst_override`, `type_id`, `uvm_set_verbosity`, `uvm_set_config_int`
